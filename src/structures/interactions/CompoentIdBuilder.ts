/** 
 *  Copyright (C) 2022 OoP1nk
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 * 
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 */

export default class ComponentIdBuilder {
    private static seperator = ":";

    private constructor() {}

    public static setDefaultSeperator(seperator: string): void {
        ComponentIdBuilder.seperator = seperator;
    }

    public static getSeperator() {
        return this.seperator;
    }

    public static build(identifier: string, ...args: Object[]): string {
        const sb: string[] = Array.of(identifier);
        if(args.length > 0) {
            args.map((item) => sb.push(item.toString()));
        }
        return sb.join(this.seperator);
    }

    public static split(id: string): string[] {
        return id.split(this.seperator);
    }
}