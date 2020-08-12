class inventoryModel 
{
    constructor()
    {
        this.itemsSpecification;
        this.dateOfOrder;
        this.orderedBy;
        this.deliveryDate;
        this.supervisedBy;
        this.quantity;
        this.rate;
        this.totalBill;
        this.gst;
        this.paidBy;
        this.paidAmount;
        this.pendingBillAmount;
        this.paidRemarks;
        //this.srNo;
        this.selectedUnit;
        this.selectedPaymentMode;
        //this.calculateTotalBill();
        //this.calculatePendingBill();
    }
    calculateTotalBill = () =>
    {
        if(this.selectedUnit == "lumpsum")
        {
           this.quantity = 1
        }
        return (this.rate * this.quantity)*(1 + this.gst/100)
    };

    calculatePendingBill = () =>
    {
        return this.totalBill - this.paidAmount

    }

    // calculateBillDetails()
    // {
    //     this.CalculateTotalBill()
    //     this.CalculatePendingBill()
    // }
}
export default inventoryModel