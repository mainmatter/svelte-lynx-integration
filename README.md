## Svelte + Lynx integration

This is a POC for an integration between [Lynx](https://lynxjs.org/) and [Svelte](https://svelte.dev/). This basically allow you to build a native application with native elements using `svelte` as the templating language.

> [!WARNING]
> As specified this is a POC, it uses an unreleased svelte version that we are working on to unlock the custom renderer API that is needed for the Lynx integration. Furthermore the custom runtime svelte will use is not fully implemented.
>
> Long story short, don't expect this to work for whatever code you throw at it!

> [!NOTE]
> Both this integration and the renderer api in svelte was written by [Mainmatter](https://mainmatter.com) and contributors.
> We offer consulting, training, and team augmentation for Svelte & SvelteKit – check out our
> [website](https://mainmatter.com/svelte-consulting/) to learn more!

### How to run the project?

If you just want to take a look at the app on your phone you can

1. Install Lynx Explorer on your device, you can follow [this guide for iOS](https://lynxjs.org/guide/start/quick-start.html#installation,explorer-platform=ios-simulator) and [this guide for Android](https://lynxjs.org/guide/start/quick-start.html#installation,explorer-platform=android)
2. Open Lynx Explorer and either manually type `https://github.com/mainmatter/svelte-lynx-integration/raw/refs/heads/main/dist/main.lynx.bundle?fullscreen=true` in the Card URL field or scan the following QR code.

![a QR code to open in the Lynx Explorer app to see the svelte app](/qr.png)

If you want to play around with the actual code and build it locally you can

1. Clone this repo and install dependencies
2. Change the code in [`/src`](/src)
3. Install Lynx Explorer on your device, you can follow [this guide for iOS](https://lynxjs.org/guide/start/quick-start.html#installation,explorer-platform=ios-simulator) and [this guide for Android](https://lynxjs.org/guide/start/quick-start.html#installation,explorer-platform=android)
4. Run `pnpm serve` and scan the generated QR code with Lynx explorer

Unfortunately there's some problem with the `rspack` dev server so you can't run the dev server and you'd have to rerun the `serve` command

## License

This repo is developed by © Mainmatter GmbH and contributors. It is released under
the [MIT License](LICENSE.md).
