const Project = require('../models/Project');
const Team = require('../models/Team');
const User = require('../models/User');
const passport = require('passport');
const session = require('express-session');

module.exports = {
    addGet: (req, res) => {
        res.render('project/create');
    },
    addPost: async (req, res) => {
        let newProj = req.body;
        if (newProj.name.trim().length < 3 || newProj.name.trim().length > 30) {
            newProj.error = "Name must be between 3 and 30 symbols!";
            res.render('project/create', newProj);
            return;
        }

        if (newProj.description.trim().length < 3 || newProj.description.trim().length > 50) {
            newProj.error = "Description must be between 3 and 50 symbols!";
            res.render('project/create', newProj);
            return;
        }

        let proj = {};
        proj.name = newProj.name.trim();
        proj.description = newProj.description;
        try {
            let projCreated = await Project.create(proj);
            if (projCreated) {
                req.flash('Project created successfully');
                res.redirect('/');
            } else {
                res.render('project/create', newProj)
            }

        } catch (err) {
            newProj.error = err;
            res.render('project/create', newProj);
        }

    },

    all: async (req, res) => {
        let projects = await Project.find().populate('team');
        res.render('project/all', {
            projects
        });
    },
    assignGet: async (req, res) => {
        try {
            if (req.user) {
                let teams = await Team.find({});
                let projects = await Project.find({
                    team: undefined
                });
                res.teams = teams;
                res.projects = projects;
                res.render('project/assign', {
                    teams,
                    projects
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
            console.log(req.body.teamName)
            console.log(req.body.projName)
            if (req.body.teamName && req.body.projName) {
                let teamName = req.body.teamName;
                let projName = req.body.projName;
                let team = await Team.findById(teamName);
                let project = await Project.findById(projName);

                project.team = team._id;
                team.projects.push(project._id);
                await project.save();
                await team.save();

                req.flash(`Project ${projName.name} assigned to team ${team.teamName}`)
                res.redirect('/');
            } else {
                req.flash('You need both team and project');
                res.redirect('/project/assign');
            }
        } catch (err) {
            console.log(err);
        }
    },
    search: (req, res) => {
        let searchModel = req.query.text;
        if (!req.query.text) {
            res.redirect('/project/all');
            return;
        }

        if (req.query.text.trim() === '') {
            res.redirect('/project/all');
            return;
        }

        Project.find({}).populate('team').then((projAll) => {
            let projects = projAll
                .filter(p =>
                    p.name.toLowerCase().includes(searchModel.toLowerCase()));
            res.flash('info', `Results for ${searchModel}`);
            res.render('project/all', {
                projects: projects
            });
        }).catch((err) => {
            console.log(err);
            res.redirect('/');
        });
    },
}