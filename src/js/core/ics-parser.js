/**
 * ics-parser.js — RFC 5545 iCalendar Parser
 * Unfolds folded lines and extracts VEVENT objects with UID, SUMMARY, DTSTART, DESCRIPTION.
 */
const IcsParser = {
    unescapeIcs: function(v) {
        if (!v) return "";
        return v.replace(/\\n/g, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\");
    },
    parseFeed: function(icsText, feedMeta) {
        const unfolded = icsText.replace(/\r?\n[ \t]/g, "");
        const lines = unfolded.split(/\r?\n/);
        const events = [];
        let inEv = false;
        let cur = {};

        for (let l of lines) {
            if (l === "BEGIN:VEVENT") {
                inEv = true;
                cur = {
                    layer: feedMeta.key,
                    chipCls: feedMeta.class,
                    icon: feedMeta.icon,
                    label: feedMeta.label
                };
            } else if (l === "END:VEVENT") {
                if (inEv && cur.summary && cur.dtstart) {
                    cur.mmdd = cur.dtstart.length >= 8 ? cur.dtstart.substring(4, 8) : "";
                    cur.month = parseInt(cur.dtstart.substring(4, 6), 10);
                    cur.day = parseInt(cur.dtstart.substring(6, 8), 10);

                    // Extract associated FSID from UID if available
                    const mFsid = cur.uid ? cur.uid.match(/[A-Z0-9]{4}-[A-Z0-9]{3,4}/i) : null;
                    cur.fsid = mFsid ? mFsid[0] : null;

                    events.push(cur);
                }
                inEv = false;
            } else if (inEv) {
                const idx = l.indexOf(":");
                if (idx > -1) {
                    const k = l.substring(0, idx).split(";")[0];
                    const v = l.substring(idx + 1);
                    if (k === "SUMMARY") cur.summary = this.unescapeIcs(v);
                    else if (k === "DTSTART") cur.dtstart = v;
                    else if (k === "DESCRIPTION") cur.description = this.unescapeIcs(v);
                    else if (k === "UID") cur.uid = v;
                }
            }
        }
        return events;
    }
};
