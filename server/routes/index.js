import express from 'express';
import fs from 'fs';
import inventoryModel from '../models/inventorymodel'

let invetoryData = new inventoryModel()

const bodyParser = require('body-parser');
const router = express.Router();
let app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(router);

/* GET home page. */

const MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb+srv://vinit:vinit@mongodb@cluster0.2lsv7.azure.mongodb.net/test',{useUnifiedTopology: true}, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    
    const db = client.db('inventory-app-dp')
    console.log(db.collections())

    const inventoryCollection = db.collection('inventories')

    let rawdata = fs.readFileSync('inventoryData.json')
    let items = JSON.parse(rawdata);


    router.get("/items",(req,res)=>{
        db.collection('inventories').find().toArray().then(items =>{
            res.send(items)
        })
    })

//Create ItemSave Function



    router.post("/items",(req,res)=>{
        console.log("POST Request received!");

        //send req.body.requestItem to the create method,(created in inventory model)

        let item = new inventoryModel()
        item.itemsSpecification = req.body.itemsSpecification
        item.dateOfOrder = new Date(req.body.dateOfOrder)
        item.orderedBy = req.body.orderedBy
        item.deliveryDate = new Date(req.body.deliveryDate)
        item.supervisedBy = req.body.supervisedBy
        item.quantity = req.body.quantity
        item.rate = req.body.rate
        //totalBill:parseDouble(req.body.totalBill),
        item.gst = req.body.gst
        item.paidBy = req.body.paidBy
        item.paidAmount = req.body.paidAmount
        //pendingBillAmount:parseDouble(req.body.pendingBillAmount),
        item.paidRemarks = req.body.paidRemarks
        //srNo:req.body.srNo,
        item.selectedUnit = req.body.selectedUnit
        item.selectedPaymentMode = req.body.selectedPaymentMode
        item.totalBill = item.calculateTotalBill()
        item.pendingBillAmount = item.calculatePendingBill()

        inventoryCollection.insertOne(item).then(result => {console.log(result)}).catch(error => console.error(error))
        res.send(item);
    });

  })



// MongoClient.connect('mongodb+srv://vinit:vinit@mongodb@cluster0.2lsv7.azure.mongodb.net/test?retryWrites=true&w=majority', {useUnifiedTopology : true}).then( client => 
// {
//     // ... do something here
//     const db = client.db('inventory-app-dp')
    

//     const inventoryCollection = db.collection('inventories')

//     let rawdata = fs.readFileSync('inventoryData.json')
//     let items = JSON.parse(rawdata);


//     router.get("/items",(req,res)=>{
//         db.collection('inventories').find().toArray().then(items =>{
//             res.send(items)
//         })
//     })


//     // router.get("/items/:id",(req,res)=>{
//     //     let itemID = req.params.id;
//     //     console.log(req.params.id)
//     //     let product = items.find((p)=>{return p.id == itemID});
//     //     let data = JSON.stringify(items);
//     //     fs.writeFileSync('inventoryData.json', data);
//     //     res.send(product);
//     // })

//     router.get("/items/:name", (req, res) => {
//         db.collection('inventories').find().toArray().then(items =>{
//             var itemName = req.params.name
            
//             let item = items.find((i)=> {return i.itemsSpecification == itemName})
//             res.send(item)
//         })
//     })

    // router.post("/items",(req,res)=>{
    //     console.log("POST Request received!");
    //     let item = new inventoryModel()
    //     item.itemsSpecification = req.body.itemsSpecification
    //     item.dateOfOrder = new Date(req.body.dateOfOrder)
    //     item.orderedBy = req.body.orderedBy
    //     item.deliveryDate = new Date(req.body.deliveryDate)
    //     item.supervisedBy = req.body.supervisedBy
    //     item.quantity = req.body.quantity
    //     item.rate = req.body.rate
    //     //totalBill:parseDouble(req.body.totalBill),
    //     item.gst = req.body.gst
    //     item.paidBy = req.body.paidBy
    //     item.paidAmount = req.body.paidAmount
    //     //pendingBillAmount:parseDouble(req.body.pendingBillAmount),
    //     item.paidRemarks = req.body.paidRemarks
    //     //srNo:req.body.srNo,
    //     item.selectedUnit = req.body.selectedUnit
    //     item.selectedPaymentMode = req.body.selectedPaymentMode
    //     item.totalBill = item.calculateTotalBill()
    //     item.pendingBillAmount = item.calculatePendingBill()

    //     inventoryCollection.insertOne(item).then(result => {console.log(result)}).catch(error => console.error(error))
    //     res.send(item);
    // });

//     // router.put("/items/:id",(req,res)=>{
//     //     inventoryCollection.findOneAndUpdate(
//     //         {id : req.params.id},
//     //         {
//     //             item = inventoryCollection.findOne(it => it.id == id,options.id)
//     //             $set:{
                    
                
//     //         }
//     //     },
//     //         options
//     //     ).then(result => {}).catch(error => console.error(error))
//     // })

//     // router.put("/item/:name", (req, res) => {
//     //     console.log("PUT Request received!");
//     //     let itemName = req.params.name;
//     //     let item = items.filter(item => {
//     //         return item.itemsSpecification == itemName;
//     //     })[0];

//     //     const index = items.indexOf(item);

//     //     let keys = Object.keys(req.body);

//     //     keys.forEach(key => {
//     //         item[key] = req.body[key];
//     //     });

//     //     items[index] = item;
//     //     let data = JSON.stringify(items);
//     //     fs.writeFileSync('inventoryData.json', data);
//     //     res.send(items);

//     //     res.json(items[index]);
//     // })


//     // router.delete("/item/:id", (req, res) => {
//     //     let itemID = req.params.id;

//     //     let item = items.filter(item => {
//     //         return item.id == itemID;
//     //     })[0];

//     //     const index = items.indexOf(item);

//     //     items.splice(index, 1);
//     //     let data = JSON.stringify(items);
//     //     fs.writeFileSync('inventoryData.json', data);
//     //     res.send(items);
//     //     res.json({ message: `User ${itemID} deleted.` });
//     // })

//   })
  


export default router;
