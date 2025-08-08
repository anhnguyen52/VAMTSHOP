const User = require("../models/user")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const {email, password} = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            // const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!password === checkUser.password) {
                resolve({
                    status: 'ERR',
                    message: 'The password of user is incorrect',
                })
            }
            const access_token = genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            await User.findByIdAndUpdate(checkUser._id, {
                access_token: access_token,
                refresh_token: refresh_token
            });

            res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                id: checkUser.id,
                isAdmin: checkUser.role,
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}

const logoutUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const checkUser = await User.findOne({_id: id})
            if(checkUser === null){
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            await User.findByIdAndUpdate(checkUser._id, {
                access_token: '',
                refresh_token: ''
            })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
            })
        }catch(e){
            reject(e)            
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            console.log("User ID:", id);
            // const allUsers = await User.find();
            // console.log("All Users:", allUsers);

            console.log('checkUser', checkUser)
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
            console.log("UpdateUser", updateUser)

            resolve({
                status: 'OK',
                message: 'SUCCESS'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            console.log("User ID:", id);
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            // await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete User Success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUsers = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await User.find({}, { password: 0 }); // Không trả về mật khẩu
            resolve({
                status: 'OK',
                message: 'Get all users successfully',
                data: users
            });
        } catch (e) {
            reject(e);
        }
    });
}
const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            // console.log("checkUser", checkUser)
            // console.log("userId", id)
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: checkUser
            })
        } catch (e) {
            reject(e)
        }
    })

}


module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getDetailsUser
}