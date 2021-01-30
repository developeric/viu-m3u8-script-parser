(async function () {
    //Injects script
    var css = "https://raw.githubusercontent.com/zackmark29/BootCDN/master/ajax/libs/layer/3.1.0/theme/default/layer.css";
    var js = "https://raw.githubusercontent.com/zackmark29/BootCDN/master/ajax/libs/layer/3.1.0/layer.js";
    a = await InjectScripts(css);
    b = document.createElement("style");
    b.type = "text/css";
    b.innerText = a;
    document.getElementsByTagName("head")[0].appendChild(b);

    c = await InjectScripts(js);
    d = document.createElement("script");
    d.type = "text/javascript";
    d.text = c;
    document.getElementsByTagName("head")[0].appendChild(d);
    ///////////////////////////////////////////////////////

    var type = user_type;
    var plan = "";
    switch (type) {
        case "premium":     plan = "PREMIUM PLAN";  break;
        case "free":        plan = "FREE PLAN";     break;
        case "anonymous":   plan = "NO MEMBER";     break;
    }

    var formTitle = `VIU M3U8 PARSER v1.1 | script by zackmark29`;
    var seriesName = details.series.name;
    var synopsis = details.current_product.synopsis;
    var epCurrent = details.current_product.number;
    var epTotal = details.series.product_total;
    var episode = `${epCurrent} of ${epTotal}`;
    var currentDuration = details.stream.duration;
    var originalDuration = details.current_product.time_duration;
    
    var email, url, m3u8Url, resolution;
    
    try { email = user_data.username; } catch { email = "Email not found"; }

    GetStreamUrl();
    function GetStreamUrl() { url = details.stream.url; }
    //initial / default
    resolution = "1080p";
    m3u8Url = url.s1080p;
    m3u8Url = BypassPreviewMode(m3u8Url, currentDuration, originalDuration); //if currenDuration is 180. preview mode

    var fontStyle = "font-size: 12px; font-family: Arial, Helvetica, sans-serif";
    layer.open({
        title: [formTitle, "font-size:13px"],
        resize: false,
        area: ["400px"],
        content: `
            \<\div style="${fontStyle}">
            <label for="subscription"><b>Subscription:</b></label>
            <label name="subscription" id="subscription"> ${plan} | </label>
            <label for="email"><b>Email:</b></label>
            <label name="email" id="email"> ${email}</label>
            <br>-----------------------------------------------------------------------------------------<br>
            <label for="series"><b>Series:</b></label>
            <label name="series" id="series"> ${seriesName} | ${synopsis}</label><br>
            <label for="episode"><b>Episode:</b></label>
            <label name="episode" id="episode"> ${episode} | </label>
            <label for="resolution"><b>Resolution:</b></label>
            <label name="resolution" id="resolution">${resolution} |</label>
            <label for="duration"><b>Duration:</b></label>
            <label name="duration" id="duration"> ${FormatTime(
            originalDuration
        )}</label>
            <br>-----------------------------------------------------------------------------------------<br>
            <form name="Rad" style="font-weight:bold">
            Resolution Selection:
                <label><input type="radio" name="rad" id="1080p" value="1080p" checked/> 1080p </label>
                <label><input type="radio" name="rad" id="720p" value="720p"/> 720p </label>
                <label><input type="radio" name="rad" id="480p" value="480p"/> 480p </label>
                <label><input type="radio" name="rad" id="240p" value="240p"/> 240p </label>
            </form>
            <textarea  id="downloadUrl" style="resize:none; height: 165px; width: 355px; ${fontStyle}" onclick="this.focus();this.select()">${m3u8Url}</textarea>
            <br><label name="status:" id="status"> ...</label>
            \<\/div>
            `,
        btnAlign: "l",
        btn: ["Download File", "Copy Url", "Close"],
        yes: function () {
            var fileName = `${seriesName.replace(" ", ".")}.EP${epCurrent}.${resolution}.zackmark29.m3u8`;
            `${SaveToFile(m3u8Url, fileName)}`;
            return false;
        },
        btn2: function () {
            $("textarea").select();
            document.execCommand("copy");
            return false;
        },
        btn3: function () {
            CloseButton(formTitle);
            layer.close();
        },
    });

    var rad = document.Rad.rad;
    rad[0].onclick = function () { UpdateStreams("1080p", url.s1080p); };
    rad[1].onclick = function () { UpdateStreams("720p", url.s720p); };
    rad[2].onclick = function () { UpdateStreams("480p", url.s480p); };
    rad[3].onclick = function () { UpdateStreams("240p", url.s240p); };

    function UpdateStreams(res, m3u8Url) {
        GetStreamUrl();
        resolution = ` ${res} |`;
        m3u8Url = m3u8Url;
        m3u8Url = BypassPreviewMode(m3u8Url, currentDuration, originalDuration);
        document.getElementById("resolution").innerHTML = resolution;
        document.getElementById("downloadUrl").innerHTML = m3u8Url;
    }

    function BypassPreviewMode(m3u8url, currentValue, replaceValue) {
        if (currentValue == 180) { return m3u8url.replace("duration=180", `duration=${replaceValue}`);
        } else { return m3u8url; //return the first result
        }
    }

    function CloseButton(formTitle) {
        layer.open({
            title: [formTitle, "font-size:10px"],
            resize: false,
            maxWidth: 10,
            btn: ["Thank You"],
            content: `Don't forget to give feedback
                    <a href="https://github.com/zackmark29/">--My Repo</a>`,
        });
    }
    async function InjectScripts(url) {
        const promise = await fetch(url, { method: "GET", cache: "no-cache" });
        const data = await promise.text();
        return data;
    }

    function FormatTime(sec) { return new Date(sec * 1000).toISOString().substr(11, 8); }

    function SetInnerText(id, value) { return (document.getElementById(id).innerHTML = value); }
    
    function SaveToFile(url, filename)
    {
        SetInnerText("status", "Downloading and saving m3u8...");
        fetch(url, { method: "GET", cache: "no-cache" }).then(async function (t) {
            const b = await t.blob();
            SetInnerText("status", "Download completed");
            var a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.setAttribute("download", filename);
            a.click();
        });
    }
})();
