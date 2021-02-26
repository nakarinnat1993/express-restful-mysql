const bcryptjs = require('bcryptjs');
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

    // const users = await models.User.findAll({
    //     attributes:['id','name',['email','username']], // as 
    //     order:[['id','desc']]
    // });

    // const sql = 'select id,name from users';
    // const users = await models.sequelize.query(sql,{
    //     type: models.sequelize.QueryTypes.SELECT
    // })


    const users = await models.User.findAll({
        attributes:{exclude:['password']},
        include:[
            {
                model :models.Blog, 
                as: 'blogs',
                attributes: ['id','title']
            }
        ],
        order:[
            ['id','desc'],
            ['blogs','id','desc']
        ]
    });

    res.status(200).json({
        data: users
    });
}

exports.show = async (req, res, next) => {
    try{
        
        const { id } = req.params;
        const user = await models.User.findByPk(id ,{
            attributes:{exclude:['password']} // as 
        });
    
        if(!user){
            const error = new Error("Not Found");
            error.statusCode = 404;
            throw error;
        }
    
        return res.status(200).json({
            data: user
        });
    } catch (error){
        return res.status(error.statusCode).json({
            error: {
                message : error.message
            }
        });
    }
    
}

exports.insert = async (req, res, next) => {
    try{
        const { name, email, password } = req.body;

        const existEmail = await models.User.findOne({where:{ email: email }});
        if (existEmail){
            const error = new Error("Exist Email");
            error.statusCode = 400;
            throw error;
        }

        const salt = await bcryptjs.genSalt(8);
        const passwordHash = await bcryptjs.hash(password, salt);

        const user = await models.User.create({
            name: name,
            email: email,
            password: passwordHash,
        })
        
        return res.status(201).json({
            message : "Insert Success",
            data: {
                id: user.id,
                name: user.name
            }
        });
    } catch (error){
        return res.status(error.statusCode).json({
            error: {
                message : error.message
            }
        });
    }
    
}

exports.update = async (req, res, next) => {
    try{
        const { id, name, email, password } = req.body;

        if(req.params.id !== id){
            const error = new Error("Error");
            error.statusCode = 400;
            throw error;
        }

        const salt = await bcryptjs.genSalt(8);
        const passwordHash = await bcryptjs.hash(password, salt);

        const user = await models.User.update({
            name: name,
            email: email,
            password: passwordHash,
        },{
            where : { id:id }
        })
        
        return res.status(200).json({
            message : "Update Success",
        });
    } catch (error){
        return res.status(error.statusCode).json({
            error: {
                message : error.message
            }
        });
    }
    
}
exports.destroy = async (req, res, next) => {
    try{
        const { id } = req.params;
        const user = await models.User.findByPk(id);
    
        if(!user){
            const error = new Error("Not Found");
            error.statusCode = 404;
            throw error;
        }
        
        await models.User.destroy({
            where:{
                id:id
            }
        });
        return res.status(200).json({
            message : "Delete Success",
        });
        
    } catch (error){
        return res.status(error.statusCode).json({
            error: {
                message : error.message
            }
        });
    }
    
}