import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import RoomInitializer from "./RoomInitializer";
import MultiMaker from "./MultiMaker";

enum MultiIndexEnum {
    None,
    Create,
    Join,
    Code
}
export default function MultiIndex() {
    const [status, setStatus] = useState(MultiIndexEnum.None);

    const handleOnCreateClick = () => {
       setStatus(MultiIndexEnum.Create); 
    }

    const handleOnJoinClick = () => {
       setStatus(MultiIndexEnum.Join); 
    }

    const handleOnCodeClick = () => {
       setStatus(MultiIndexEnum.Code); 
    }
    return (
        <div className="items-center justify-center text-primary w-full min-h-[20rem] rounded text-center border-2 border-primary">
            <div className="text-2xl font-bold mb-5 rounded-top py-4 bg-primary text-secondary">
                <p className="">Multi Game</p>
            </div>
            {status===MultiIndexEnum.None &&
            <div>
                <div className="py-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOnCreateClick}
                        onHoverStart={() => { }}
                        className="rounded bg-green-600 hover:text-primary text-white text-xl font-bold p-5 w-[20rem]"
                    >
                        Create
                    </motion.button>
                </div>

                <div className="py-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOnJoinClick}
                        onHoverStart={() => { }}
                        className="rounded bg-blue-600 hover:text-primary text-white text-xl font-bold p-5 w-[20rem]"
                    >
                        Join
                    </motion.button>
                </div>

                <div className="py-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOnCodeClick}
                        onHoverStart={() => { }}
                        className="rounded bg-blue-300 hover:text-primary text-white text-xl font-bold p-5 w-[20rem]"
                    >
                        Join with Code
                    </motion.button>
                </div>
            </div>
            }
            {status===MultiIndexEnum.Create && <MultiMaker/>}
            
        </div>
    )
}