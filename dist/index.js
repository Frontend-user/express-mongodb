"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./repositories/db");
const app_1 = require("./app");
const PORT = 3000;
app_1.app.get('/', (req, res) => {
    res.send('w');
});
app_1.app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.client.connect();
        yield db_1.client.db('blogs').collection('blogs').deleteMany({});
        res.sendStatus(204);
    }
    catch (error) {
        console.error('Ошибка при попытке удалить все данные из бд');
    }
}));
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDb)();
    app_1.app.listen(PORT, () => {
        console.log(`START on PORT ${PORT}`);
    });
});
startApp();
