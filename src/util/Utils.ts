import axios from "axios";

export default class Utils {
    public static async request(route: string) {
        return axios.get(route).then((res) => res.data);
    }
}