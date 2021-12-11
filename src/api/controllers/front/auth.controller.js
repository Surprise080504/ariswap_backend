const User = require("../../models/users.model");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

exports.register = async (req, res, next) => {
  try {
    let { username, address, email, password } = req.body;

    if (username && email && password && address) {
      email = email.toLowerCase();

      let user = await User.findOne({ address });
      if (user) {
        return res
          .status(200)
          .send({ status: false, message: "Wallet already exists" });
      }

      user = await User.create({
        username,
        address,
        email,
        password,
      });

      var accessToken = await user.token();
      user = user.transform();
      let data = {
        ...user,
        accessToken,
      };

      return res.status(200).send({
        status: true,
        message: "User registered successfully",
        data: data,
      });
    } else
      return res
        .status(200)
        .send({ status: false, message: "Required fields are missing" });
  } catch (error) {
    next(error);
  }
};

/**
 * Returns jwt token if valid address and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    let { address, sign } = req.body;
    // console.log("bodysdmcsd", req.body);
    const user = await User.findOne({ address }).exec();

    if (!user) {
      return res.status(200).send({
        status: false,
        message:
          "There is no account linked to that address, Please signup first",
        notExist: 1,
      });
    }

    passport.use(
      new localStrategy(
        { usernameField: "address" },
        async (username, password, done) => {
          let user = await User.findOne(
            { address: username },
            "address email password"
          );
          if (!user) {
            return done(null, false, {
              status: false,
              message:
                "There is no account linked to that address, Please signup first",
              notExist: 1,
            });
          } else if (!user.verifyPassword(password)) {
            return done(null, false, {
              status: false,
              message: "Incorrect Password",
            });
          }
          return done(null, user);
        }
      )
    );

    passport.authenticate("local", async (err, user, info) => {
      if (err)
        return res.status(200).send({
          err,
          status: false,
          message: "Oops! Something went wrong while authenticating",
        });
      else if (user) {
        {
          var accessToken = await user.token();
          user = user.transform();
          let data = {
            ...user,
            accessToken,
          };
          delete data.password;

          return res.status(200).send({
            status: true,
            message: "User logged in successfully",
            data,
          });
        }
      } else
        return res
          .status(200)
          .send({ status: false, message: "Incorrect Password" });
    })(req, res);
  } catch (error) {
    return next(error);
  }
};
