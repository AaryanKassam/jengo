import React, { useMemo, useRef, useState } from 'react';
import './SwipeDeck.css';

export default function SwipeDeck({
  items,
  getKey,
  renderCard,
  onLike,
  onPass,
  emptyTitle = 'Nothing left to review',
  emptyBody = 'Come back later for more.'
}) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const pointerIdRef = useRef(null);

  const current = items[index] || null;
  const canInteract = Boolean(current);

  const like = () => {
    if (!current) return;
    onLike?.(current);
    setIndex((i) => i + 1);
    setDragX(0);
    setIsDragging(false);
  };

  const pass = () => {
    if (!current) return;
    onPass?.(current);
    setIndex((i) => i + 1);
    setDragX(0);
    setIsDragging(false);
  };

  const threshold = 110;
  const label = useMemo(() => {
    if (!isDragging) return null;
    if (dragX > 35) return { text: 'LIKE', kind: 'like' };
    if (dragX < -35) return { text: 'PASS', kind: 'pass' };
    return null;
  }, [dragX, isDragging]);

  const onPointerDown = (e) => {
    if (!canInteract) return;
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!canInteract) return;
    if (!isDragging) return;
    if (pointerIdRef.current !== e.pointerId) return;
    setDragX(e.clientX - startXRef.current);
  };

  const onPointerUp = (e) => {
    if (!canInteract) return;
    if (pointerIdRef.current !== e.pointerId) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    pointerIdRef.current = null;

    if (dragX > threshold) {
      like();
      return;
    }
    if (dragX < -threshold) {
      pass();
      return;
    }
    setDragX(0);
    setIsDragging(false);
  };

  return (
    <div className="swipe">
      <div className="swipe__stage">
        {!current ? (
          <div className="swipe__empty">
            <div className="swipe__emptyTitle">{emptyTitle}</div>
            <div className="swipe__emptyBody">{emptyBody}</div>
          </div>
        ) : (
          <div
            className="swipe__card"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{
              transform: `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`,
              transition: isDragging ? 'none' : 'transform 180ms ease'
            }}
            data-key={getKey?.(current) || index}
            role="group"
            aria-label="Swipe card"
          >
            {label ? (
              <div className={`swipe__label ${label.kind}`}>
                {label.text}
              </div>
            ) : null}
            {renderCard(current)}
          </div>
        )}
      </div>

      <div className="swipe__actions">
        <button type="button" className="swipe__btn swipe__btn--pass" onClick={pass} disabled={!current}>
          Pass
        </button>
        <div className="swipe__count">
          {Math.min(index + (current ? 1 : 0), items.length)} / {items.length}
        </div>
        <button type="button" className="swipe__btn swipe__btn--like" onClick={like} disabled={!current}>
          Like
        </button>
      </div>
    </div>
  );
}

