# Techno Fab Industries

A responsive, custom-designed static website based on the supplied Techno Fab Industries brochure. Uses self-hosted GSAP 3.14.2 and ScrollTrigger, self-hosted fonts, and optimized brochure images.

## Run

On this Windows computer, double-click `start-website.cmd`. It uses installed Node.js or the bundled Codex runtime, starts a local server, and opens the website.

For other machines, use Node.js 18 or newer. No package installation is needed.

```sh
npm run dev
```

Open http://localhost:5173. Run `npm run build` to create the deployable `dist/` directory. Any static host can serve `public/` or `dist/`.

## Features

- GSAP hero typography, image parallax, section reveals, SVG drawing animation and scroll progress.
- Expanding service image accordion synchronized with the service details. Desktop hover, mobile tap, and keyboard arrows/Home/End select a process. Application gallery includes category filters and detailed dialogs.
- Accessible native dialogs, keyboard navigation and reduced-motion support. Content remains visible without GSAP.
- Quote form with validation, a prepared email, copy fallback and editable details. **No enquiry is sent or stored by this website.** Visitors send it through their email app and attach drawings there.
- Direct phone, email and map links; downloadable company brochure.

## Motion effects

The site uses lightweight native adaptations inspired by [Magic UI](https://magicui.design/docs/components): button shimmer and click ripples, image glare, a pointer-following service highlight, a one-time service border beam, blur-fade image entrances, sequential checklist entries, and animated hover links. Existing GSAP text reveals and scroll progress remain in place.

No React, Motion, extra runtime dependencies, or external asset requests are added. Entrance effects play once; hover effects use fine-pointer devices; moving highlights update only on pointer movement. Animations pause in background tabs. Reduced-motion changes disable the new effects immediately. These are custom static-site adaptations, not installed React components.

## Content and assets

Company information and illustrative images come from the supplied brochure. CNC bending is named as requested by the client. Product photos are marked illustrative. No machine capacity, certifications, delivery promises, client logos or project statistics have been invented.

The image accordion adapts the Le Thanh component supplied by the user to the existing static site. An optional React/TypeScript version and setup notes are included under `components/`; these are not loaded by the live website.

Contact details are in `public/index.html`. Enquiry and application details are in `public/app.js`. Layout and styles are in `public/styles.css`.

## Publication

To receive submissions directly instead of opening email, connect a form endpoint or email provider before changing the form's success behavior. A public domain and any mail service credentials must be configured separately. Font licenses and the GSAP copyright/license notice are in `public/vendor/`.

The Sites connector is not enabled for this workspace, so this deliverable is local and has not been published. The contents of `dist/` can be uploaded to a static hosting provider.

The site has five pages: Home, About, Capabilities, Industries, and Contact. Edit the HTML files in public/ directly. scripts/site-template.html preserves the original single-page source; upgrade-site.cjs is a one-time migration, not a build step. Run scripts/verify-pages.cjs with Node to check local page links.

## Current enquiry delivery
The form now uses Submit and requires a phone number or email for follow-up. It no longer opens the visitor's email app. Delivery is pending the owner's final recipient address and an email delivery backend/provider. An address alone does not enable delivery.

Each public HTML form has an empty data-endpoint attribute. While empty, Submit displays an explicit preview notice and sends/stores no personal details. Once a backend is implemented, set this to its POST endpoint on all five pages. The endpoint must validate inputs server-side and return JSON {"success":true} only after accepting delivery. Keep provider credentials and the recipient configuration on the server. The client preserves input on errors and prevents duplicate clicks during submission.

The sample testimonials are visibly labelled mock content and must be replaced before publication.
