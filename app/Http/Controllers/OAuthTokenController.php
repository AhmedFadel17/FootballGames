<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Laravel\Passport\Http\Controllers\AccessTokenController as PassportAccessTokenController;
use Psr\Http\Message\ResponseInterface as PsrResponseInterface;
use Psr\Http\Message\ServerRequestInterface as PsrRequestInterface;
use Symfony\Component\HttpFoundation\Response;
use Laravel\Passport\Token;
class OAuthTokenController extends PassportAccessTokenController
{
    public function discovery(): JsonResponse
    {
        $url = config('app.url');
        return response()->json([
            'issuer' => $url,
            'authorization_endpoint' => $url . '/oauth/authorize',
            'token_endpoint' => $url . '/oauth/token',
            'userinfo_endpoint' => $url . '/api/auth/userinfo',
            'end_session_endpoint' => $url . '/oauth/logout',
            'revocation_endpoint' => $url . '/oauth/tokens/revoke',
            'jwks_uri' => $url . '/oauth/jwks',
            'response_types_supported' => ['code'],
            'subject_types_supported' => ['public'],
            'id_token_signing_alg_values_supported' => ['RS256'],
            'scopes_supported' => ['openid', 'profile', 'email'],
        ]);
    }

    public function jwks(): JsonResponse
    {
        $publicKeyStr = file_get_contents(storage_path('oauth-public.key'));
        $publicKey = openssl_pkey_get_public($publicKeyStr);
        $keyDetails = openssl_pkey_get_details($publicKey);

        return response()->json([
            'keys' => [
                [
                    'kty' => 'RSA',
                    'n' => rtrim(strtr(base64_encode($keyDetails['rsa']['n']), '+/', '-_'), '='),
                    'e' => rtrim(strtr(base64_encode($keyDetails['rsa']['e']), '+/', '-_'), '='),
                    'alg' => 'RS256',
                    'use' => 'sig',
                    'kid' => 'passport-key',
                ]
            ]
        ]);
    }

    public function issueToken(PsrRequestInterface $psrRequest, PsrResponseInterface $psrResponse): Response
    {
        $parsedBody = $psrRequest->getParsedBody();
        if (empty($parsedBody)) {
            $bodyContents = (string) $psrRequest->getBody();
            $json = json_decode($bodyContents, true);
            if (is_array($json)) {
                $psrRequest = $psrRequest->withParsedBody($json);
            }
        }

        $response = parent::issueToken($psrRequest, $psrResponse);

        if ($response->getStatusCode() === 200) {
            $data = json_decode($response->getContent(), true);

            if (isset($data['access_token'])) {
                $jwtParts = explode('.', $data['access_token']);
                if (count($jwtParts) === 3) {
                    $payloadJson = base64_decode(str_replace(['-', '_'], ['+', '/'], $jwtParts[1]));
                    $payload = json_decode($payloadJson, true);

                    if (isset($payload['sub'])) {
                        // Pass the incoming request body to check if this is a refresh token flow
                        $idToken = $this->generateIdToken($payload, $psrRequest);
                        $data['id_token'] = $idToken;

                        $response->setContent(json_encode($data));
                    }
                }
            }
        }

        return $response;
    }
    protected function revokeOldAccessTokenFromRefreshToken(?string $refreshTokenString): void
    {
        if (!$refreshTokenString)
            return;

        try {
            $encrypter = app(\Illuminate\Contracts\Encryption\Encrypter::class);
            $decrypted = $encrypter->decrypt($refreshTokenString, false);
            $tokenData = json_decode($decrypted, true);

            if (isset($tokenData['access_token_id'])) {
                Token::where('id', $tokenData['access_token_id'])->update(['revoked' => true]);
            }
        } catch (\Throwable $e) {
        }
    }
    protected function generateIdToken(array $accessTokenPayload, PsrRequestInterface $psrRequest): string
    {
        $appUrl = rtrim(config('app.url'), '/');
        $parsedBody = $psrRequest->getParsedBody();

        $authTime = $accessTokenPayload['auth_time'] ?? $accessTokenPayload['iat'] ?? time();

        $header = [
            'alg' => 'RS256',
            'typ' => 'JWT',
            'kid' => 'passport-key',
        ];

        $payload = [
            'iss' => $appUrl,
            'sub' => (string) $accessTokenPayload['sub'],
            'aud' => $accessTokenPayload['aud'] ?? '',
            'exp' => $accessTokenPayload['exp'] ?? (time() + 3600),
            'iat' => $accessTokenPayload['iat'] ?? time(),
            'auth_time' => (int) $authTime,
        ];

        $headerEncoded = $this->base64UrlEncode(json_encode($header));
        $payloadEncoded = $this->base64UrlEncode(json_encode($payload));

        $signatureInput = $headerEncoded . '.' . $payloadEncoded;

        $privateKeyStr = file_get_contents(storage_path('oauth-private.key'));
        $privateKey = openssl_pkey_get_private($privateKeyStr);

        openssl_sign($signatureInput, $signature, $privateKey, OPENSSL_ALGO_SHA256);
        $signatureEncoded = $this->base64UrlEncode($signature);

        return $signatureInput . '.' . $signatureEncoded;
    }

    protected function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}