const JwtService = require('../service/JwtService')
const bcrypt = require('bcryptjs');
const User = require('../models/user')

const createUser = async (req, res) => {
    try {
        const { first_name, last_name,avatar, gender, date_of_birth,
             email, password, confirmPassword,role, phone, address, is_active } = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);

        // if (!first_name|| !last_name || !avatar || !gender || !date_of_birth || !email || !password || !phone || !address || !is_active) {
        //     return res.status(400).json({
        //         status: 'ERR',
        //         message: 'All input fields are required'
        //     });
        // }

        if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid email format'
            });
        }

        const existingCustomer = await User.findOne({ email });
        if (existingCustomer) {
          return res.status(400).json({
            status: 'ERR',
            message: "Email already exists"
          });
        }

        // if (password !== confirmPassword) {
        //     return res.status(400).json({
        //         status: 'ERR',
        //         message: 'Password and Confirm Password must match'
        //     });
        // }

        // Mã hóa mật khẩu trước khi lưu
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        const userData = { first_name, last_name,avatar, gender, date_of_birth, 
            email, password, phone, address, is_active, role, access_token: '', refresh_token: '' };

        const response = await User.create(userData);

        const access_token = JwtService.genneralAccessToken({
            id: response.id,
            role: response.role
        })

        const refresh_token = JwtService.genneralRefreshToken({
            id: response.id,
            role: response.role
        })

        await User.findByIdAndUpdate(response._id, {
            access_token: access_token,
            refresh_token: refresh_token
        });

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })

        return res.status(201).json({
            status: 'Success',
            message: 'User created successfully',
            data: {
                response,
                access_token,
                refresh_token,
            }
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal Server Error'
        });
    }
};


const loginUser = async (req, res) => {
    try {
        console.log(req.body)
        const {email, password} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!email || !password ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }

        const checkUser = await User.findOne({
            email: email
        })
        // console.log('checkUser', checkUser) 
        // console.log('checkUserId:', checkUser.id) 

        
        if (checkUser === null) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The user is not defined'
            })
        }
        // const comparePassword = bcrypt.compareSync(password, checkUser.password)
        if (password !== checkUser.password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The password of user is incorrect',
            })
        }

        const access_token = JwtService.genneralAccessToken({
            id: checkUser.id,
            role: checkUser.role
        })

        const refresh_token = JwtService.genneralRefreshToken({
            id: checkUser.id,
            role: checkUser.role
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
        
        return res.status(200).json({
            status: "success",
            message: "User login successfully",
            data: {
              id: checkUser.id,
              role: checkUser.role,
              access_token,
              refresh_token,
            }
          })
    } catch (e) {
        console.error("Error in loginUser:", e);
        return res.status(500).json({ status: 'ERR', message: e.message || "Unknown error" });
    }
}

const logoutUser = async (req, res) => {
    try{
        res.clearCookie('refresh_token')
        const userId = req.params.id
        const checkUser = await User.findOne({_id: userId})
        await User.findByIdAndUpdate(checkUser._id, {
            access_token: '',
            refresh_token: ''
        })
        return res.status(200).json({
            status: 'OK',
            message: 'Logout success'
          });
    }catch(e){
        console.error("Error in loginUser:", e);
        return res.status(500).json({ status: 'ERR', message: e.message || "Unknown error" });
    }

}

const refreshToken = async (req, res) => {
    try {
      const refresh_token = req.cookies.refresh_token;
      console.log("Received refresh_token from Cookie:", refresh_token);
  
     
      if (!refresh_token) {
        return res.status(401).json({
          status: "ERR",
          message: "Refresh token is required",
        });
      }
  
      const response = await JwtService.refreshTokenJwtService(refresh_token);
  
      const userId = req.params.id
      const checkUser = await User.findOne({_id: userId})
        if (checkUser === null) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The user is not defined'
            })
        }

        await User.findByIdAndUpdate(checkUser._id, {
            access_token: response.access_token,
        });

      return res.status(200).json({
        status: "SUCCESS",
        access_token: response.access_token,
      });
    } catch (error) {
      return res.status(500).json({
        status: "ERR",
        message: error.message,
      });
    }
  };

  const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        // console.log("userId", userId)
        if (!userId) {
            return res.status(404).json({   
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const checkUser = await User.findOne({
            _id: userId
        })
        if (checkUser === null) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The user is not defined'
            })
        }

        return res.status(200).json({
            status: 'OK',
            message: 'SUCCESS',
            data: checkUser
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
}

  
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        console.log("userId", userId)
        const checkUser = await User.findOne({
            _id: userId
        })
        console.log("User ID:", userId);
        // console.log('checkUser', checkUser)
        if (checkUser === null) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The user is not found'
            })
        }

        const updateUser = await User.findByIdAndUpdate(userId, data, { new: true })

        return res.status(200).json({
            status: 'OK',
            message: 'SUCCESS',
            data: updateUser
        })
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const checkUser = await User.findOne({
            _id: userId
        })
        if (checkUser === null) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The user is not found'
            })
        }

        const deleteUser = await User.findByIdAndDelete(userId)
        return res.status(200).json({
            status: 'OK',
            message: 'Delete user success',
            data: deleteUser
        })
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        return res.status(200).json({
            status: 'OK',
            message: 'Get all users successfully',
            data: users
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
}


const changePassword = async (req, res, next) => {
    try {
      const { email, oldPassword, newPassword, confirmPassword } = req.body;
      console.log("Received data:", {
        email,
        oldPassword,
        newPassword,
        confirmPassword,
      });
  
      // Kiểm tra thông tin đầu vào
      if (!email || !oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          status: "ERR",
          message: "Please provide all required fields",
        });
      }
      // Tìm kiếm user trong DB
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          status: "ERR",
          message: "User not found",
        });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          status: "ERR",
          message: "New password and confirm password do not match",
        });
      }
  
      // Kiểm tra mật khẩu cũ
    //   const isOldPasswordValid = await bcrypt.compareSync(
    //     oldPassword,
    //     user.password
    //   );
      if (oldPassword !== user.password) {
        return res.status(400).json({
          status: "ERR",
          message: "Old password is incorrect",
        });
      }
  
      // Kiểm tra nếu mật khẩu mới trùng mật khẩu cũ
    //   const isNewPasswordSameAsOld = await bcrypt.compare(
    //     newPassword,
    //     user.password
    //   );
      if (newPassword === user.password) {
        return res.status(400).json({
          status: "ERR",
          message: "New password must be different from the old password",
        });
      }
  
      // Mã hóa mật khẩu mới
    //   const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = newPassword; // Cập nhật mật khẩu mới
  
      // Lưu vào DB
      await user.save();
  
      return res.status(200).json({
        status: "OK",
        message: "Password updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'User ID is required'
            });
        }
        
        const response = await User.findByIdAndUpdate(userId, req.body, { new: true });
        return res.status(200).json({
            status: 'OK',
            message: 'User profile updated successfully',
            data: response
        });
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message
        });
    }
};


module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getDetailsUser,
    refreshToken,
    changePassword,
    updateProfile
}