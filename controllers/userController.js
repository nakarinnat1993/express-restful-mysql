const models = require('../models/index');

exports.index = async (req, res, next) => {

    // const users = await models.User.findAll();
    // const users = await models.User.findAll({
    //     // attributes:['id','name','email'],
    //     attributes:{exclude:['password']},
    //     // where:{
    //     //     email:'nut@mail.com'
    //     // },
    //     order:[['id','desc']]
    // });
    const users = await models.User.findAll({
        attributes:['id','name',['email','username']], // as 
        order:[['id','desc']]
    });
    // const sql = 'select id,name from users';
    // const users = await models.sequelize.query(sql,{
    //     type: models.sequelize.QueryTypes.SELECT
    // })


    res.status(200).json({
        data: users
    });
}