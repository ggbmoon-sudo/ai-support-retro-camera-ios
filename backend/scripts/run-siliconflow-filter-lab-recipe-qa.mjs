import { runSiliconFlowFilterLabRecipeQA } from "../src/qa/siliconFlowFilterLabRecipeQAGate.mjs";

const report = await runSiliconFlowFilterLabRecipeQA({
  args: process.argv.slice(2)
});

console.log(JSON.stringify(report, null, 2));
