<?php

namespace App\Http\Controllers;

use Laravel\Passport\Http\Controllers\AccessTokenController as PassportAccessTokenController;
use Psr\Http\Message\ResponseInterface as PsrResponseInterface;
use Psr\Http\Message\ServerRequestInterface as PsrRequestInterface;
use Symfony\Component\HttpFoundation\Response;

class OAuthTokenController extends PassportAccessTokenController
{
    /**
     * Issue an access token and inject a custom id_token if the openid scope is requested.
     */
    public function issueToken(PsrRequestInterface $psrRequest, PsrResponseInterface $psrResponse): Response
    {
        // 1. Let Passport process the token request normally
        $response = parent::issueToken($psrRequest, $psrResponse);

        if ($response->getStatusCode() === 200) {
            $data = json_decode($response->getContent(), true);

            if (isset($data['access_token'])) {
                // Decode the access token payload (JWT) to get client_id, user_id (sub), and expiry
                $jwtParts = explode('.', $data['access_token']);
                if (count($jwtParts) === 3) {
                    $payloadJson = base64_decode(str_replace(['-', '_'], ['+', '/'], $jwtParts[1]));
                    $payload = json_decode($payloadJson, true);

                    if ($payload && isset($payload['sub'])) {
                        // Generate the id_token matching OIDC spec
                        $idToken = $this->generateIdToken($payload);
                        $data['id_token'] = $idToken;

                        // Update response content
                        $response->setContent(json_encode($data));
                    }
                }
            }
        }

        return $response;
    }

    /**
     * Generate a signed OIDC ID Token JWT.
     */
    protected function generateIdToken(array $accessTokenPayload): string
    {
        $appUrl = rtrim(config('app.url'), '/');

        // ID token header
        $header = [
            'alg' => 'RS256',
            'typ' => 'JWT',
            'kid' => 'passport-key', // kid matching the JWK served by /oauth/jwks
        ];

        // ID token payload claims
        $payload = [
            'iss' => $appUrl,
            'sub' => (string) $accessTokenPayload['sub'],
            'aud' => $accessTokenPayload['aud'] ?? '',
            'exp' => $accessTokenPayload['exp'] ?? (time() + 3600),
            'iat' => $accessTokenPayload['iat'] ?? time(),
            'auth_time' => time(),
        ];

        // Encode header & payload
        $headerEncoded = $this->base64UrlEncode(json_encode($header));
        $payloadEncoded = $this->base64UrlEncode(json_encode($payload));

        $signatureInput = $headerEncoded . '.' . $payloadEncoded;

        // Sign the token using Passport's private key
        $privateKeyStr = file_get_contents(storage_path('oauth-private.key'));
        $privateKey = openssl_pkey_get_private($privateKeyStr);

        openssl_sign($signatureInput, $signature, $privateKey, OPENSSL_ALGO_SHA256);
        $signatureEncoded = $this->base64UrlEncode($signature);

        return $signatureInput . '.' . $signatureEncoded;
    }

    /**
     * Base64Url encode helper.
     */
    protected function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}
