#!/usr/bin/env node
import {
  defaultXiaoyiDeepseekRelayConfig,
  xiaoyiDeepseekRelayReadinessSummary
} from "../src/providers/xiaoyiDeepseekRelayProviderContract.mjs";

const summary = xiaoyiDeepseekRelayReadinessSummary(process.env, defaultXiaoyiDeepseekRelayConfig());

console.log(JSON.stringify(summary, null, 2));
