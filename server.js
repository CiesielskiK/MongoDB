const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://mkru:haslo@ds237489.mlab.com:37489/first-mongo-db');

const userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  created_at: Date,
  updated_at: Date
});

userSchema.methods.manify = next => {
    this.name = `${this.name}-boy`;
    return next(null, this.name);
};

userSchema.pre('save', next => {
  const currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

const User = mongoose.model('User', userSchema);

const kenny = new User({
    name: 'Kenny',
    username: 'Kenny_the_boy',
    password: 'password'
})

kenny.manify((err, name) => {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
})

const benny = new User({
    name: 'Benny',
    username: 'Benny_the_boy',
    password: 'password'
})

benny.manify((err, name) => {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
})

const mark = new User({
    name: 'Mark',
    username: 'Mark_the_boy',
    password: 'password'
})

mark.manify((err, name) => {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
})

const findAllUsers = () => {
  return User.find({}, (err, res) => {
    if (err) throw err;
    console.log('Actual database records are ' + res)
  })
}

const findSpecificRecord = () => {
  return User.find({ username: 'Kenny_the_boy' }, (err, res) => {
    if (err) throw err;
    console.log('Record you are looking for is ' + res);
  })
}

const updateUserPassword = () => {
  return User.findOne({ username: 'Kenny_the_boy' })
    .then(user => {
      console.log('Old password is ' + user.password);
      console.log('Name: ' + user.name);
      user.password = 'newPassword';
      console.log('New password is ' + user.password);
      return user.save(err => {
        if (err) throw err;
        console.log('Użytkownik: ' + user.name + ' został pomyślnie zaktualizowany');
      })
    })
}

const updateUsername = function() {
    return User.findOneAndUpdate({ username: 'Benny_the_boy' }, { username: 'Benny_the_man' }, { new: true }, function(err, user) {
        if (err) throw err;
        console.log('Nazwa uzytkownika po aktualizacji to ' + user.username);
    })
}

const findMarkAndDelete = () => {
    return User.findOne({ username: 'Mark_the_boy' })
        .then(user => {
            return user.remove(() => {
                console.log('User: ' + user.username + ' successfully deleted');
            });
        })
}

const findKennyAndDelete = () => {
    return User.findOne({ username: 'Kenny_the_boy' })
        .then(user => {
            return user.remove(() => {
                console.log('User: ' + user.username + ' successfully deleted');
            });
        });
}

const findBennyAndRemove = () => {
    return User.findOneAndRemove({ username: 'Benny_the_man' })
        .then(user => {
            return user.remove(() => {
                console.log('User: ' + user.username + ' successfully deleted');
            });
        });
}

Promise.all([kenny.save(), mark.save(), benny.save()])
    .then(findAllUsers)
    .then(findSpecificRecord)
    .then(updateUserPassword)
    .then(updateUsername)
    .then(findMarkAndDelete)
    .then(findKennyAndDelete)
    .then(findBennyAndRemove)
    .catch(console.log.bind(console))
