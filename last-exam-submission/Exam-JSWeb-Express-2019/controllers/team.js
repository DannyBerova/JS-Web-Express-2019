const Project = require('../models/Project');
const Team = require('../models/Team');
const User = require('../models/User');
const passport = require('passport');
const session = require('express-session');

module.exports = {
    addGet: (req, res) => {
        res.render('team/create');
    },
    addPost: async (req, res) => {
        let newTeam = req.body;
        if (newTeam.name.trim().length < 3 || newTeam.name.trim().length > 30) {
            newTeam.error = "Name must be between 3 and 30 symbols!";
            res.render('team/create', newTeam);
            return;
        }
        let team = {};
        team.name = newTeam.name.trim();

        try {
            let teamCreated = await Team.create(team);
            if (teamCreated) {
                req.flash('Team created successfully');
                res.redirect('/');
            } else {
                res.render('team/create', newTeam)
            }
        } catch (err) {
            newTeam.error = err;
            res.render('team/create', newTeam);
        }
    },
    all: async (req, res) => {
        try {
            let teams = await Team.find({}).populate('projects').populate('members');
            res.render('team/all', {
                teams
            });

        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },
    assignGet: async (req, res) => {
        try {
            if (req.user) {
                let teams = await Team.find({});
                let users = await User.find();
                res.teams = teams;
                res.users = users;

                res.render('team/assign', {
                    teams,
                    users
                });
            } else {
                res.render('home/index');
            }
        } catch (err) {
            console.log(err);
        }
    },
    assignPost: async (req, res) => {
        try {
            if (req.body.teamName && req.body.userName) {
                let teamName = req.body.teamName;
                let userName = req.body.userName;
                let team = await Team.findById(teamName);
                let user = await User.findById(userName);
                for (const userA of team.members) {
                    if (userA.toString() === user._id.toString()) {
                        req.flash('User already in team');
                        res.redirect('/team/assign');
                        return;
                    }
                }
                team.members.push(user._id);
                user.teams.push(team._id);
                await user.save();
                await team.save();
                req.flash(`${user.username} assigned to team ${team.name}`)
                res.redirect('/');
            } else {
                req.flash('You need both team and user');
                res.redirect('/team/assign');
            }
        } catch (err) {
            console.log(err);
            res.redirect('/');
        }
    },

    search: (req, res) => {
        let searchModel = req.query.text;
        if (!req.query.text) {
            res.redirect('/team/all');
            return;
        }

        if (req.query.text.trim() === '') {
            res.redirect('/team/all');
            return;
        }

        Team.find({}).populate('projects').populate('members').then((teamAll) => {
            let teams = teamAll
                .filter(t =>
                    t.name.toLowerCase().includes(searchModel.toLowerCase()));
            res.flash('info', `Results for ${searchModel}`);
            res.render('team/all', {
                teams: teams
            });

        }).catch((err) => {
            console.log(err);
            res.redirect('/');
        });
    },
}