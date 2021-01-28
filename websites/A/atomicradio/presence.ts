const presence = new Presence({
    clientId: "777954584013963265"
});

const browsingTimestamp = Date.now();
let channelInfo = {name: "", artist: "", title: "", end: 0};
let presenceData: PresenceData = {
    largeImageKey: "atr-logo",
    smallImageKey: "play-button"
};

async function getStationData(channel: string) {
    if(channelInfo.name != channel || Date.now() >= presenceData.endTimestamp * 1000) {
        channelInfo.name = channel;
        const data = await window.fetch("https://api.atomicradio.eu/channels/" + channelInfo.name).then((res) => res.json());
        presenceData.state = data.song.artist;
        presenceData.details = data.song.title;
        presenceData.startTimestamp = data.song.start_at;
        presenceData.endTimestamp = data.song.end_at;
        presenceData.smallImageText = `ATR.${channelInfo.name} • ${data.listeners} listeners`;
        presenceData.smallImageKey = "play-button";
        presence.setActivity(presenceData, true);
        return;
    }
}

function clearPresenceData() {
    channelInfo = {name: '', artist: '', title: '', end: 0};
    delete presenceData.smallImageKey;
    delete presenceData.state;
    delete presenceData.details;
    delete presenceData.startTimestamp;
    delete presenceData.endTimestamp;
    delete presenceData.smallImageText;
}

presence.on('UpdateData', async () => {
    let playerOpen = false;
    const playBar = document.getElementById("PlayBar");
    if(playBar.style.display == "block") {
        playerOpen = true;
        const playerButtonState = document.getElementById("Player_Play_Button_State");
        if(playerButtonState.className.includes('fa-play')) {
            playerOpen = false;
        }
    }

    if(playerOpen) {
        const channelName = document.getElementById("Player_Station_Name");
        const channel = String(channelName.innerText).split(".")[1];
        getStationData(channel);
    } else {
        clearPresenceData();
        if(window.location.pathname == "/" || window.location.pathname.startsWith('/home')) {
            presenceData.details = "Browsing...";
            delete presenceData.startTimestamp;
            presence.setActivity(presenceData, true);
        } else if(window.location.pathname.startsWith("/partner")) {
            presenceData.details = "Viewing the partner information";
            presenceData.startTimestamp = browsingTimestamp;
            presence.setActivity(presenceData, true);
        } else if(window.location.pathname.startsWith("/history")) {
            presenceData.details = "Viewing the song history";
            presenceData.startTimestamp = browsingTimestamp;
            presence.setActivity(presenceData, true);
        } else if(window.location.pathname.startsWith("/streams")) {
            presenceData.details = "Viewing the streamurls";
            presenceData.startTimestamp = browsingTimestamp;
            presence.setActivity(presenceData, true);
        } else if(window.location.pathname.startsWith("/imprint")) {
            presenceData.details = "Viewing the imprint";
            presenceData.startTimestamp = browsingTimestamp;
            presence.setActivity(presenceData, true);
        } else if(window.location.pathname.startsWith("/privacy")) {
            presenceData.details = "Viewing the privacy";
            presenceData.startTimestamp = browsingTimestamp;
            presence.setActivity(presenceData, true);
        } else {
            presenceData.details = "Browsing...";
            delete presenceData.startTimestamp;
            presence.setActivity(presenceData, true);
        }
    }
});