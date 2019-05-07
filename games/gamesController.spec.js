const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);
chai.should();

// TODO
// describe("Games", () => {
//   describe("GET /", () => {
//     it("should get all games", done => {
//       chai
//         .request(app)
//         .get("/v1/games")
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a("object");
//           done();
//         });
//     });
//   });
// });
