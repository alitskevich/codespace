/** Checks if copying an image to clipboard is supported by the browser.
 *  @see https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API (clipboard-write permission)
 */
async function canWriteToClipboard() {
  try {
    const result = await navigator.permissions.query({
      name: "clipboard-write",
    } as any);
    return result.state === "granted" || result.state === "prompt";
  } catch (error) {
    return false;
  }
}

export async function copyToClipboard(data: any, toast) {
  const can = await canWriteToClipboard();

  if (!can) {
    toast({ id: "error-clipboard-copy", level: "error", message: `Can't copy to clipboard` });
    return;
  }

  if (typeof data === "string") {
    data = { value: data };
  }

  const items: ClipboardItem[] = [];

  if (data.value) {
    const type = data.type ?? "text/plain";
    items.push(
      new ClipboardItem({
        [type]: new Blob([data.value], { type }),
      })
    );
  } else if (data instanceof Blob) {
    items.push(new ClipboardItem({ [data.type]: data }));
  }

  navigator.clipboard.write(items).then(
    () => {
      toast({ id: "clipboard-copy", message: "Copied to clipboard" });
    },
    (_: Error) => {
      // @ts-expect-error missing interface
      void navigator.clipboard.write(items[0]).then(
        () => {
          toast({
            id: "clipboard-copy-text",
            message: "Copied to clipboard",
          });
        },
        (err: Error) => {
          toast({
            id: "error-clipboard-copy",
            level: "error",
            message: `Could not copy to clipboard: ${err.message}`,
          });
        }
      );
    }
  );
}
