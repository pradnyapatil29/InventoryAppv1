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

let rawdata = fs.readFileSync('inventoryData.json')
let items = JSON.parse(rawdata);


router.get("/items", (req, res) => {
    res.send(items)
})

router.get("/items/:id", (req, res) => {
    let itemID = req.params.id;
    console.log(req.params.id)
    let product = items.find((p) => { return p.id == itemID });
    let data = JSON.stringify(items);
    fs.writeFileSync('inventoryData.json', data);
    res.send(product);
})

router.get("/itembyname/:name", (req, res) => {
    let itemName = req.params.name;
    let productList = [];
    items.forEach(item => {
        if (item.itemsSpecification == itemName) {
            productList.push(item);
        }
    });
    res.send(productList);
})

router.post("/items", (req, res) => {
    console.log("POST Request received!");

    let item = new inventoryModel()
    item.id = req.body.id,
        item.itemsSpecification = req.body.itemsSpecification,
        item.dateOfOrder = new Date(req.body.dateOfOrder),
        item.orderedBy = req.body.orderedBy,
        item.deliveryDate = req.body.deliveryDate,
        item.supervisedBy = req.body.supervisedBy,
        item.quantity = req.body.quantity,
        item.rate = req.body.rate,
        //totalBill:parseDouble(req.body.totalBill),
        item.gst = req.body.gst,
        item.paidBy = req.body.paidBy,
        item.paidAmount = req.body.paidAmount,
        //pendingBillAmount:parseDouble(req.body.pendingBillAmount),
        item.paidRemarks = req.body.paidRemarks,
        //srNo:req.body.srNo,
        item.selectedUnit = req.body.selectedUnit,
        item.selectedPaymentMode = req.body.selectedPaymentMode
    item.totalBill = item.calculateTotalBill();

    items.push(item);
    let data = JSON.stringify(items);
    fs.writeFileSync('inventoryData.json', data);
    res.send(items);
});

app.put("/item/:id", (req, res) => {
    console.log("PUT Request received!");
    let itemID = req.params.id;
    let item = items.filter(item => {
        return item.id == itemID;
    })[0];

    const index = items.indexOf(item);

    let keys = Object.keys(req.body);

    keys.forEach(key => {
        item[key] = req.body[key];
    });

    items[index] = item;
    let data = JSON.stringify(items);
    fs.writeFileSync('inventoryData.json', data);
    res.send(items);

    res.json(items[index]);
})


app.delete("/item/:id", (req, res) => {
    let itemID = req.params.id;

    let item = items.filter(item => {
        return item.id == itemID;
    })[0];

    const index = items.indexOf(item);

    items.splice(index, 1);
    let data = JSON.stringify(items);
    fs.writeFileSync('inventoryData.json', data);
    res.send(items);
    res.json({ message: `User ${itemID} deleted.` });
})

router.post("/itemList", (req, res) => {
    console.log("POST Request received!");


    let itemSpec = req.body.itemSpec;
    let fromDate = new Date(req.body.fromDate);
    let toDate = new Date(req.body.toDate);
    console.log(itemSpec);

    let itemList = items.filter((p) => {
        return (fromDate <= (new Date(p.dateOfOrder)) &&
            toDate >= (new Date(p.dateOfOrder)) &&
            itemSpec == p.itemsSpecification)
    });

    // let data = JSON.stringify(items);
    // fs.writeFileSync('inventoryData.json', data);
    res.send(itemList);
});

export default router;