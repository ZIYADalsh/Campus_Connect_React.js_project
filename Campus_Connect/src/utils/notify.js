export function notify(message, kind = "success", duration = 4000) {
  window.dispatchEvent(
    new CustomEvent("cc:notify", { detail: { message, kind, duration } })
  );
}
