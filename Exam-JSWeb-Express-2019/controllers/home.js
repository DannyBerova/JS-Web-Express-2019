
//if home has sort or else, require models

module.exports = {
    index: (req, res) => {

        
        res.render('home/index');
    }
};

//messenger example with admin home

// module.exports = {
//     index: async (req, res) => {
//         try {
//             if (req.user) {
//                 if (req.user.roles.indexOf('Admin') !== -1) {
//                     let threads = await Thread.find().populate('users');
//                     res.flash('You are an awesome admin because you use flashify');
//                     res.render('home/index', {
//                         threads
//                     });
//                 } else {
//                     res.render('home/index');
//                 }
//             } else {
//                 res.render('home/index');
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }
// };