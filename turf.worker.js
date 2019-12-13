import { TurfAnalysis } from './index';

addEventListener(
  'message',
  async ({ data, ports: [port, handler] }) => {
    const {
      instanceArgs: {
        dataset,
        conversionType,
        cutoffValue,
      },
      command: {
        command,
        args,
      },
    } = data;

    const turfAnalysisInstance = new TurfAnalysis(dataset, conversionType, cutoffValue);

    if (!['calcMetrics', 'calcLadder'].includes(command)) {
      return;
    }

    port.postMessage({
      command,
      result: turfAnalysisInstance[command](args, (res) => {
        handler.postMessage(res);
      }),
    });
  },
);
