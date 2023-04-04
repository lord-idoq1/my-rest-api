const { User } = require('../MongoDB/schema');
const toMs = require('ms');
const { limitCount, limitPremium } = require('../settings');
const tokens = 'helena'
module.exports.tokens = tokens

    async function addPremium(username, customKey, expired) {
        User.updateOne({username: username}, {apikey: customKey, premium: Date.now() + toMs(expired), limit: limitPremium}, function (err, res) {
            if (err) throw err;
        })
    }
    module.exports.addPremium = addPremium

    async function ExpiredTime() {
        let users = await User.find({});
        users.forEach(async(data) => {
            let { premium, defaultKey, username } = data
            if (!premium || premium === null) return
            if (Date.now() >= premium) {
                User.updateOne({username: username}, {apikey: defaultKey, premium: null, limit: limitCount}, function (err, res) {
                    if (err) throw err;
                    console.log(`Masa Premium ${username} sudah habis`)
                })
            }
        })
    }
    module.exports.ExpiredTime = ExpiredTime

    async function deletePremium(username) {
        let users = await User.findOne({username: username});
        let key = users.defaultKey
        User.updateOne({username: username}, {apikey: key, premium: null, limit: limitCount}, function (err, res) {
            if (err) throw err;
        })
    }
    module.exports.deletePremium = deletePremium

    async function checkPremium(username) {
        let users = await User.findOne({username: username});
        if (users.premium === null) {
            return false;
        } else {
            return true;
        };
    };
    module.exports.checkPremium = checkPremium;

    async function changeKey(username, key) {
        User.updateOne({username: username}, {apikey: key}, function (err, res) {
            if (err) throw err;
        });
    }
    module.exports.changeKey = changeKey

    async function resetOneLimit(username) {
        let users = await User.findOne({username: username});
        if (users !== null) {
            User.updateOne({username: username}, {limit: limitCount}, function (err, res) {
                if (err) throw err;
            });
        }
    }
    module.exports.resetOneLimit = resetOneLimit
