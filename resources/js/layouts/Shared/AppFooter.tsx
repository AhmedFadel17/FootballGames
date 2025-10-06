import { Link } from "react-router";
import { MainRoutes } from "@/routes";
import Button from "@/components/ui/button/Button";
import { footerData } from "@/routes/footer";
const AppFooter: React.FC = () => {
    const appName = import.meta.env.VITE_APP_NAME ?? "FG";

    return (
        <div className="relative bg-steel-gray text-white">
            <svg
                className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16 text-steel-gray"
                preserveAspectRatio="none"
                viewBox="0 0 1440 54"
            >
                <path
                    fill="currentColor"
                    d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
                />
            </svg>
            <div className="px-4 pt-12 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
                <div className="grid gap-16 row-gap-10 mb-8 lg:grid-cols-6">
                    <div className="md:max-w-md lg:col-span-2">
                        <div className='flex items-center gap-2'>
                            <img src='./images/logo/logo-icon.svg' width={50} height={100} alt='' />
                            <h1 className={`text-xl font-bold text-main`}>{appName}</h1>
                        </div>

                        <div className="mt-4 lg:max-w-sm">
                            <p className="text-sm text-gray-300">
                                {footerData.description}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 row-gap-8 lg:col-span-4 md:grid-cols-4">
                        {footerData.links.map(({ title, links }, index) => (
                            <div
                                key={index}
                            >
                                <p className="text-white text-lg font-semibold tracking-wide text-teal-accent-400">
                                    {title}
                                </p>
                                <ul className="mt-2 space-y-2">

                                    {links.map(({ title, path }, index) => (
                                        <li
                                            key={index}
                                        >
                                            <Link
                                                to={path}
                                                className="text-sm transition-colors duration-300 text-gray-300 hover:text-teal-accent-400">
                                                {title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-between pt-5 pb-10 border-t border-deep-purple-accent-200 sm:flex-row">
                    <p className="text-sm text-gray-300">
                        © Copyright {new Date().getFullYear()} {appName} Inc. All rights reserved.
                    </p>

                    <div className="flex items-center mt-4 space-x-4 sm:mt-0">
                        {footerData.social.map(({ title, path, icon: Icon }, index) => (
                            <Link
                                key={index}
                                to={path}
                                className="transition-colors bg-white p-2 text-primary rounded-lg duration-300 hover:bg-secondary">
                                <Icon className='' />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AppFooter;
