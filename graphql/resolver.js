const bcrypt = require("bcryptjs");
const Event = require('../models/event');
const User = require('../models/users');

const userHandler = async ID => {
    try{
        const use = await User.findById(ID);
        return { 
                ...use._doc, 
                password: null,
                createdEvents: eventHandler.bind(this, use._doc.createdEvents)
            }
    } catch (err){
        throw err
    }
}

const eventHandler = async eve => {
    try {
        const events = await Event.find({ _id: { $in:eve} });
        return events.map( even => {
            return {
                ...even._doc,
                date: new Date(even._doc.date).toISOString(),
                creator: userHandler.bind(this, even.creator)
            }
        });
    } catch (err) {
        throw err;
    }
}

const allResolvers = {
    events: async () => {
        try {
            const events = await Event.find({})
            return events.map( e => {
                return {
                    ...e._doc, 
                    _id: e.id, 
                    date: new Date(e._doc.date).toISOString(),
                    creator: userHandler.bind(this,e._doc.creator)
                }
            })
        } catch (err) {
            throw(err)
        }
    },
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            price: +args.eventInput.price,
            description: args.eventInput.description,
            date: new Date(args.eventInput.date), 
            creator: "5ea8b1ce3a8d122e44d65ee7"
        });

        let returnEventLater; 
        
        try{
            const result = await event.save(); //async
            returnEventLater = {
                ...result._doc, 
                _id: result.id, 
                date: new Date(result._doc.date).toISOString(),
                creator: userHandler.bind(this,"5eab02874649ce1bccf6ca97")
            };
            const creator = await User.findById("5eab02874649ce1bccf6ca97");
          
            if(!creator) {
                throw new Error("user not found")
            }
            creator.createdEvents.push(event); //K
            await creator.save();

            return returnEventLater;

        } catch (err) {
            throw err
        }
    },
    createUser: async args => {
        try{
            const existingUser = await User.findOne({email: args.userInput.email});
            if (existingUser) {
                throw new Error('User exist already')
            };

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            
            const result = await user.save();
                console.log(result._doc);
            return { ...result._doc, _id: result.id, password: null }

        } catch (err) {
            throw(err);
        }
    }
};

module.exports = allResolvers;