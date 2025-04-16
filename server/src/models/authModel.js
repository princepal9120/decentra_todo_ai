
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const userSchema= new mongoose.Schema({
   name:{
        type: String,
        required: ['true', "Username is required."],
        trim: true,

    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: ['true', "Password is required."],
        minlength: [8, "Password must be at least 8 characters."],
    },
    walletAddress: {
        type: String,
        trim: true,
        default: '',
    }

},{ timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    try {
        const salt= await bcrypt.genSalt(10)
        this.password= await bcrypt.hash(this.password, salt)
        next();
    } catch (error) {
        next(error);
    }
})
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}
const User = mongoose.model('User', userSchema);

module.exports = User;