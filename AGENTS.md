<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Brand data (name, contacts, address, hours, nav) lives in src/config/site.ts — template is reused per client, so components never hardcode business info.
- Menu data lives in src/data/products.ts as a plain Product[] — keeps a future external source (e.g. Google Sheets) a drop-in replacement.
- No backend/database: static site targeting static hosting.
- WhatsApp links go through src/lib/whatsapp.ts; an unset number shows a demo notice instead of a fake link.
