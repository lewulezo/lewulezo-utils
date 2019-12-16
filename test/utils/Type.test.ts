import { string, integer, date, set, array } from "@/utils/Types";

class TmUser {
    @string userName: string;
    @integer userId: number;
    @date hireDate: Date;
    @string userMobile: string;
    @set series: Set<string>;
    @array positions: string[];
}
let tmUser = new TmUser();
// tmUser['userName'] = null;
Object.assign(tmUser, {
    userId: 'dadfa', 
    series: ['V90', 'V80', 'V80'],
    positions: 'IDPS',
    hireDate: NaN
});
console.log(tmUser.userId);
console.log(tmUser.series);
console.log(tmUser.positions);
console.log(tmUser.hireDate);