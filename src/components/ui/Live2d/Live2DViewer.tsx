import { useEffect, useRef, useState } from "react";
import * as S from "./style";

const MODEL_PATH = "/assets/live2d/MyWaifuTeacher/4.model3.json";
const CUBISM_CORE_SRC = "/assets/live2d/live2dcubismcore.min.js";

type Props = {
  className?: string;
  speaking?: boolean;
};

export default function Live2DViewer({ className, speaking = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const speakingRef = useRef(speaking);

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

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
        let eyeOpenValue = 1;

        model.on("pointerdown", () => {
          isDragging = true;
        });
        model.on("pointermove", (e) => {
          if (isDragging) {
            const localPoint = e.data.getLocalPosition(model);
            if (localPoint.y < 800 && localPoint.y >= 300) {
              isPetting = true;
            } else {
              isPetting = false;
            }
          }
        });

        const stopPetting = () => {
          isDragging = false;
          isPetting = false;
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
            const time = performance.now();
            const value = (Math.sin(time * 0.01) + 1) / 2;

            try {
              coreModel?.setParameterValueById?.('ParamMouthOpenY', value);
            } catch (e) { }
          } else {
            try {
              coreModel?.setParameterValueById?.('ParamMouthOpenY', 0);
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
