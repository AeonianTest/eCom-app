//The following snippet is based on Week 8 Practical code Course Material COSC2410 semester 1, 2024.

const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.user.findAll();

  res.json(users);
};

// Select one user from the database.
exports.findByUsername = async (req, res) => {
  const user = await db.user.findOne({ where: { username: req.query.username }});

  if(user){
    res.json({ userID: user.userID });
  }else{
    res.status(404).json({error:'user not found'});
  }
};

exports.one = async (req, res) => {
  const user = await db.user.findByPk(req.params.userID);
  console.log(req.params.userID);
  if(user){
    res.json(user);
  }else{
    res.status(404).json({error:`user not found${req.params.userID}`});
  }
};

// Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
  //used to be db.user.findByPk. there is no 'where' statement.
  //const user = await db.user.findByPk( 3 );

  //console.log(await argon2.verify(user.password_hash, req.query.password));
  //console.log('helloworld');

  //console.log(user);
  //console.log(await argon2.verify(user.password_hash, req.query.password));
  try{
    const user = await db.user.findOne({ where: { username: req.query.username } });
    //console.log(user);
    if(user === null || await argon2.verify(user.password_hash, req.query.password) === false)
      // Login failed.
      res.json(null);
    else
    //return user
      res.json(user);
  }catch{
    res.json(null);
  }

};

// Create a user in the database.
exports.create = async (req, res) => {

  const password = req.body.password_hash;

  const validated = [
    { name: 'lowercase', regex: RegExp("(?=.*[a-z])") },
    { name: 'uppercase', regex: RegExp("(?=.*[A-Z])") },
    { name: 'length', regex: RegExp(".{8,}") },
    { name: 'digit', regex: RegExp("(?=.*\\d)") },
    { name: 'symbol', regex: RegExp("(?=.*\\W)") }
  ];

  //basic js implementation/conversion of the signup regex validation logic
  const validateCategory = validated.map((validateState) => ({
    ...validateState,
    value: validateState.regex.test(password)
  }));

  //check if all validation criteria are met
  const isValid = validateCategory.every((validateState) => validateState.value);


  //returns status 400 if password does not meet criteria
  // i dont care about making it look good because if someone's bypassing the
  // js they're too nefarious to appreciate clean UX anyway
  if (!isValid) {
    return res.status(400).json({ message: "password does not meet criteria" });
  }

  //extra api side validation
  if (req.body.user_email == null || req.body.username == null){
    return res.status(400).json({message: "user or email is null"});
  }

  if (!req.body.user_email.includes('@')){
    return res.status(400).json({message:"email in incorrect format"});
  }

  console.log(req.body.password_hash);
  const hash = await argon2.hash(req.body.password_hash, { type: argon2.argon2id });
  console.log(req.body);



  const user = await db.user.create({
    username: req.body.username,
    password_hash: hash,
    //user_bio: req.body.user_bio,
    date_joined: req.body.date_joined,
    user_email: req.body.user_email
    //user_address: req.body.user_address
  });

  res.json(user);
};

  // use one update command for both general information and password
  // both cannot happen at once
  //if update password = true, then use a different code block dicatatd by and conditional statement
  //this keeps us from having to make multiple functions to update user details.
 
exports.update = async (req, res)=>{
  if(req.body.passwordBool === false){
    const result = await db.user.update(
      {
        user_email: req.body.user_email,
        user_bio: req.body.user_bio,
        user_address: req.body.user_address,    
      },
      {
        where:{
          userID: req.body.userID
        }
      }
    )
    res.json(result);

  }
  else{
    const hash = await argon2.hash(req.body.user_password, { type: argon2.argon2id });
    
    const password = req.body.user_password;

    const validated = [
      { name: 'lowercase', regex: RegExp("(?=.*[a-z])") },
      { name: 'uppercase', regex: RegExp("(?=.*[A-Z])") },
      { name: 'length', regex: RegExp(".{8,}") },
      { name: 'digit', regex: RegExp("(?=.*\\d)") },
      { name: 'symbol', regex: RegExp("(?=.*\\W)") }
    ];

    //basic js implementation/conversion of the signup regex validation logic
    const validateCategory = validated.map((validateState) => ({
      ...validateState,
      value: validateState.regex.test(password)
    }));

    //check if all validation criteria are met
    const isValid = validateCategory.every((validateState) => validateState.value);


    //returns status 400 if password does not meet criteria
    // i dont care about making it look good because if someone's bypassing the
    // js they're too nefarious to appreciate clean UX anyway
    if (!isValid) {
      return res.status(400).json({ message: "password does not meet criteria" });
    }
    
    const result = await db.user.update(
      {
        password_hash:hash
      },
      {
        where:{
          userID: req.body.userID
        }
      }
    )
    res.json(result);

  }

  console.log();
}

exports.deleteUser = async (req, res)=>{

  //console.log(req.params.userID);
  const result = await db.user.destroy({
    where: {
      userID: req.params.userID
    },
  });

  res.json(result);
}