import { useEffect, useRef, useState } from "react";
import * as S from "./style";
import { useLive2DStore } from "@/store/useLive2DStore";
import { usePettingMission } from "@/hooks/useMission";

const MODEL_PATH = "/assets/live2d/MyWaifuTeacher/4.model3.json";
const CUBISM_CORE_SRC = "/assets/live2d/live2dcubismcore.min.js";

// phoneme을 Live2D mouth open 값으로 변환
const phonemeToMouthValue = (phoneme: string): number => {
  switch (phoneme.toUpperCase()) {
    case 'A': return 1.0;   // 크게 벌림
    case 'E': return 0.6;   // 중간 정도
    case 'I': return 0.3;   // 살짝 벌림
    case 'O': return 0.9;   // 둥글게 크게
    case 'U': return 0.5;   // 오므림
    case 'M': return 0.0;   // 입 닫음
    case 'F': return 0.4;   // 약간 열림
    case 'S': return 0.3;   // 약간 열림
    case 'T': return 0.3;   // 약간 열림
    case 'R': return 0.5;   // 중간 정도
    case 'W': return 0.6;   // 중간 정도
    case 'K': return 0.4;   // 중간 정도
    default: return 0.0;    // 기본값 (입 닫음)
  }
};

type Props = {
  className?: string;
};

export default function Live2DViewer({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const speaking = useLive2DStore((state) => state.speaking);
  const lipSyncData = useLive2DStore((state) => state.lipSyncData);
  const startTime = useLive2DStore((state) => state.startTime);

  const speakingRef = useRef(speaking);
  const lipSyncDataRef = useRef(lipSyncData);
  const startTimeRef = useRef(startTime);
  const { mutate: completePetting } = usePettingMission();
  const completePettingRef = useRef(completePetting);

  useEffect(() => {
    speakingRef.current = speaking;
    lipSyncDataRef.current = lipSyncData;
    startTimeRef.current = startTime;
  }, [speaking, lipSyncData, startTime]);

  useEffect(() => {
    completePettingRef.current = completePetting;
  }, [completePetting]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    let app: import("pixi.js").Application | null = null;
    let destroyed = false;
    let disposeModel: (() => void) | undefined;

    const loadCubismCore = () =>
      new Promise<void>((resolve, reject) => {
        if (window.Live2DCubismCore) return resolve();

        const script = document.createElement("script");
        script.src = CUBISM_CORE_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("live2dcubismcore 스크립트를 불러오지 못했습니다."));

        document.body.appendChild(script);
      });

    const init = async () => {
      try {
        await loadCubismCore();
        const [{ Application, Ticker, TickerPlugin }, { Live2DModel }] =
          await Promise.all([
            import("pixi.js"),
            import("pixi-live2d-display/cubism4"),
          ]);

        if (TickerPlugin) {
          Application.registerPlugin?.(TickerPlugin);
        }

        app = new Application({
          backgroundAlpha: 0,
          antialias: true,
          resizeTo: container,
        });

        if (destroyed || !app) return;

        if (app.view instanceof HTMLCanvasElement) {
          container.appendChild(app.view);
        }

        const tickerClass = Ticker ?? window.PIXI?.Ticker ?? undefined;

        if (!tickerClass) {
          throw new Error("PIXI ticker 클래스를 찾을 수 없습니다.");
        }

        Live2DModel.registerTicker(tickerClass);

        const model = await Live2DModel.from(MODEL_PATH);
        if (destroyed || !app) {
          model.destroy();
          return;
        }

        model.anchor.set(0.5, 0.5);
        model.interactive = true;
        app.stage.addChild(model);

        try {
          if (model.internalModel?.eyeBlink) {
            model.internalModel.eyeBlink = null;
          }
        } catch (e) { }

        const layoutModel = () => {
          model.position.set(
            app!.renderer.width / 2,
            app!.renderer.height * 0.82
          );

          const base =
            Math.min(
              app!.renderer.width / model.width,
              app!.renderer.height / model.height
            ) || 1;

          model.scale.set(base * 1.35);
        };

        layoutModel();
        window.addEventListener("resize", layoutModel);

        let isDragging = false;
        let isPetting = false;
        let hasPetted = false;
        let eyeOpenValue = 1;
        let currentMouthValue = 0; // 부드러운 전환을 위한 현재 입모양 값

        model.on("pointerdown", () => {
          isDragging = true;
          hasPetted = false;
        });
        model.on("pointermove", (e) => {
          if (isDragging) {
            const localPoint = e.data.getLocalPosition(model);
            if (localPoint.y < 800 && localPoint.y >= 300) {
              isPetting = true;
              hasPetted = true;
            } else {
              isPetting = false;
            }
          }
        });

        const stopPetting = () => {
          if (hasPetted) {
            completePettingRef.current();
          }
          isDragging = false;
          isPetting = false;
          hasPetted = false;
        };

        model.on("pointerup", stopPetting);
        model.on("pointerupoutside", stopPetting);

        const mouthTicker = () => {
          if (!model?.internalModel) return;
          const coreModel = model.internalModel.coreModel as any;

          const targetEyeValue = isPetting ? 0 : 1;
          const smoothSpeed = 0.1;
          eyeOpenValue += (targetEyeValue - eyeOpenValue) * smoothSpeed;

          if (Math.abs(eyeOpenValue - targetEyeValue) < 0.05) {
            eyeOpenValue = targetEyeValue;
          }

          try {
            if (!coreModel) return;

            const leftEyeIndex = coreModel._parameterIds?.indexOf('ParamEyeLOpen') ?? -1;
            const rightEyeIndex = coreModel._parameterIds?.indexOf('ParamEyeROpen') ?? -1;

            if (leftEyeIndex !== -1 && coreModel._parameterValues) {
              coreModel._parameterValues[leftEyeIndex] = eyeOpenValue;
            }

            if (rightEyeIndex !== -1 && coreModel._parameterValues) {
              coreModel._parameterValues[rightEyeIndex] = eyeOpenValue;
            }
          } catch (e) { }

          if (speakingRef.current) {
            let targetValue = 0;

            // lipSyncData가 있으면 정확한 립싱크 사용
            if (lipSyncDataRef.current && startTimeRef.current && Array.isArray(lipSyncDataRef.current)) {
              const currentTime = (performance.now() - startTimeRef.current) / 1000;
              const data = lipSyncDataRef.current;

              // 현재 시간에 해당하는 phoneme 찾기
              let currentPhoneme: string | null = null;
              for (let i = 0; i < data.length; i++) {
                if (currentTime >= data[i].startTime && currentTime < data[i].endTime) {
                  currentPhoneme = data[i].phoneme;
                  break;
                }
              }

              // phoneme에 따라 목표 입모양 설정
              if (currentPhoneme) {
                targetValue = phonemeToMouthValue(currentPhoneme);
              } else {
                targetValue = 0;
              }
            } else {
              // 기본 사인파 애니메이션
              const time = performance.now();
              targetValue = (Math.sin(time * 0.01) + 1) / 2;
            }

            // 부드러운 전환을 위한 보간
            const smoothSpeed = 0.3;
            currentMouthValue += (targetValue - currentMouthValue) * smoothSpeed;

            try {
              coreModel?.setParameterValueById?.('ParamMouthOpenY', currentMouthValue);
            } catch (e) { }
          } else {
            // speaking이 false일 때 입 닫기
            const smoothSpeed = 0.2;
            currentMouthValue += (0 - currentMouthValue) * smoothSpeed;

            try {
              coreModel?.setParameterValueById?.('ParamMouthOpenY', currentMouthValue);
            } catch (e) { }
          }
        };

        tickerClass.shared.add(mouthTicker);

        disposeModel = () => {
          tickerClass.shared.remove(mouthTicker);
          window.removeEventListener("resize", layoutModel);
          model.destroy();
        };
      } catch (err) {
        console.error(err);
        setError("모델을 불러오는 중 오류가 발생했습니다.");
      }
    };

    init();

    return () => {
      destroyed = true;
      disposeModel?.();
      if (app) {
        if (app.view instanceof HTMLCanvasElement && app.view.parentElement) {
          app.view.parentElement.removeChild(app.view);
        }
        app.destroy(true);
      }
    };
  }, []);

  return (
    <S.Wrapper className={className}>
      <S.CanvasContainer ref={containerRef} />
      {error ? <S.ErrorOverlay>{error}</S.ErrorOverlay> : null}
    </S.Wrapper>
  );
}
