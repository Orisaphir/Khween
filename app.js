class Package {
    version = '';
}

class Config {
    token = ''
    activity_type = ''
    activity_name = ''
    activity_status = ''
    activity_url = ''
    master_id = ''
    cooldown = ''
}

class KhweenApp {
    package = new Package();
    config = new Config();

}
exports.KhweenApp = KhweenApp;
exports.Khween = new KhweenApp();