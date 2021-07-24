const baskom = require("baskom");
const printerDriver = require("./driver/printer/index");
const thermal = require("node-thermal-printer");
const PrinterThermal = thermal.printer
const PrinterTypes = thermal.types;

baskom()
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        next();
    })
    .get("/get-printer", () => {
        return JSON.stringify(printerDriver.getPrinters() || [], null, 4);
    })
    .get("/test-printer", async (req) => {
        const printer = new PrinterThermal({
            type: PrinterTypes[req.query.type || "EPSON"],
            interface: 'printer:' + req.query.name,
            driver: printerDriver
        });
        printer.println("Hello World");
        printer.println("Hello World");
        printer.printQR("QR CODE");
        printer.println("");
        printer.println("");
        printer.println("");
        const isConnected = await printer.isPrinterConnected();
        if (isConnected) {
            if (req.query.cd) {
                printer.openCashDrawer();
            }
            await printer.execute();
            return "Process print";
        }
        return "Not Connected";
    })
    .listen(8091, () => {
        console.log("Success run driver on port 8091")
    })