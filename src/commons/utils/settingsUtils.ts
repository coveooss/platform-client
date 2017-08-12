export class SettingUtils {
    static saveSettings(settings: any) {
        if (SettingUtils.isValidSettings(settings)) {
            // TODO: save settings in a local file
            console.log('*********Settings************');
            console.log(settings);
            console.log('*****************************');
            
        }
    }

    static isValidSettings(settings: any): boolean {
        try {
            JSON.parse(settings)
        } catch (error) {
            return false;
        }
        return true;
    }
}
