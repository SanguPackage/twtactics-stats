TW Tactics Stats
================
Reports of TW Tactics usage.  
Is anyone actually using this?  

Some stats also at: [SanguPackage Youtube Channel](https://www.youtube.com/channel/UCZhtzaXAvHm46Gda4umXGMA)

Development
-----------

In \api\stats:
`php -S localhost:8000`

API
---

- `api/registertactics.php`: If anyone sends a postcard, this is the place to put the registration info.
- `api/twtacticsusage.php`: Registers when someone downloads a new TW Snapshot
  - TWTactics POSTs to: `https://tw-stats.sangu.be/twtacticsusage.php`
- `api/stats`: Some stats for tactics usage
  - [Stats Site](https://tw-stats.sangu.be)
