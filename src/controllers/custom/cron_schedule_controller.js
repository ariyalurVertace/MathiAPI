export async function onCronTick(cronName) {
    try {
        switch (cronName) {
            case "MapTodaysVolunteersForPersons":
                MapTodaysVolunteersForPersons();
                break;

            default:
                break;
        }
    } catch (error) {
        return false;
    }
}

export async function MapTodaysVolunteersForPersons() {
    return true;
}
