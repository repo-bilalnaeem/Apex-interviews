declare module 'zxcvbn' {
  interface ZXCVBNFeedback {
    warning: string;
    suggestions: string[];
  }

  interface ZXCVBNResult {
    score: 0 | 1 | 2 | 3 | 4;
    feedback: ZXCVBNFeedback;
    crack_times_display: {
      offline_fast_hashing_1e10_per_second: string;
    };
    password: string;
  }

  function zxcvbn(password: string, userInputs?: string[]): ZXCVBNResult;

  export = zxcvbn;
}
