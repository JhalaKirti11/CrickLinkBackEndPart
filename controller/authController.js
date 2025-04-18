import {User} from "../model/user.model.js"; 

export const googleSignIn = async (req, res) => {
    const { email, name, googleToken } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name,
                googleId: googleToken,
                role: "player"
            });
            await user.save();
        }
        res.status(200).json({ user, message: "Google Sign-In Successful" });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: "Google Sign-In Failed" });
    }
};
