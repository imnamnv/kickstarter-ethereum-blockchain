const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");

//Remove every compile process because we only compile one time.
//If we compile again, the .sol file change.
//So we don't need old version build file
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");
const output = solc.compile(source, 1).contracts;

//check if buildpPath file is exist or not. if not it will create buildPath file
fs.ensureDirSync(buildPath);

for (const contract in output) {
  //for key of object
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
