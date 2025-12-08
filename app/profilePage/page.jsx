import { FiChevronRight } from "react-icons/fi";

export default function ProfilePage(){

    return(
        <section className="container mx-auto">
            <div className="w-full my-2 flex">
                {/* Left Bar */}
                <div className="w-1/4 pr-3">
                    <h1 className="text-lg">Me</h1>
                    <ul className="ml-4">
                        <li className="flex items-center justify-between  font-semibold">
                            Profile
                            <FiChevronRight/>
                        </li>
                    </ul>
                  
                </div>
                {/* Right content */}
                <div className="w-full text-center">
                    <h1>Login with your account</h1>
                </div>

            </div>
        </section>
    );
}