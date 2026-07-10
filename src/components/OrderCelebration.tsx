import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import WelcomeAnimation from "./WelcomeAnimation";

const OrderCelebration = () => {
  const lastPlacedOrderAt = useSelector(
    (state: RootState) => state.orders.lastPlacedOrderAt,
  );
  const previousTimestamp = useRef<number | null>(lastPlacedOrderAt);
  const [showOrderCelebration, setShowOrderCelebration] = useState(false);

  useEffect(() => {
    if (!lastPlacedOrderAt) return;

    if (previousTimestamp.current !== lastPlacedOrderAt) {
      setShowOrderCelebration(true);
    }

    previousTimestamp.current = lastPlacedOrderAt;
  }, [lastPlacedOrderAt]);

  if (!showOrderCelebration) return null;

  return (
    <WelcomeAnimation
      variant="order"
      onClose={() => setShowOrderCelebration(false)}
    />
  );
};

export default OrderCelebration;
