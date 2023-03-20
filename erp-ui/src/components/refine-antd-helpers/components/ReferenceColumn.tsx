import {BaseKey, useNavigation, useResource, useRouterContext} from "@pankod/refine-core";
import React, {ReactNode} from "react";
import {RenderedCell} from "rc-table/lib/interface";

export type ReferenceColumnProps<T> = {
    recordItemId: BaseKey;
    children: ReactNode | RenderedCell<T>;
}

export function ReferenceColumn<T>({recordItemId, children}: ReferenceColumnProps<T>) {
    const {showUrl: generateShowUrl} = useNavigation();
    const {Link} = useRouterContext();
    const {id, resource} = useResource({recordItemId});
    const showUrl = generateShowUrl(resource.route!, id!);

    return (
        <Link to={showUrl} replace={false}>
            {children}
        </Link>
    )
}