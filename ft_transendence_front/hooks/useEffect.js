const useEffect = (callback, dependencies) => {
  if (typeof window === "undefined") {
    return; // 브라우저 환경이 아닌 경우 종료
  }

  const effectCallback = () => {
    callback();
  };

  // 의존성 배열이 주어진 경우, 해당 값이 변경될 때만 콜백 함수 호출
  if (dependencies && Array.isArray(dependencies)) {
    for (const dependency of dependencies) {
      window.addEventListener(dependency, effectCallback);
    }
    // 클린업 함수 반환
    return () => {
      for (const dependency of dependencies) {
        window.removeEventListener(dependency, effectCallback);
      }
    };
  } else {
    // 의존성 배열이 주어지지 않은 경우, 컴포넌트가 로드될 때마다 콜백 함수 호출
    window.addEventListener("load", effectCallback);
    // 클린업 함수 반환
    return () => {
      window.removeEventListener("load", effectCallback);
    };
  }
};

export default useEffect;
