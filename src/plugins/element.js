import Vue from 'vue'
import { Button, Tabs, TabPane, Input, Row, Col, Checkbox, Form, FormItem, Message, CheckboxButton, Container, Header, Aside, Main, Menu, Submenu, MenuItem, MenuItemGroup,
Breadcrumb, BreadcrumbItem, Card, Select, Option, Table, TableColumn, Switch, Pagination, Dialog, Popconfirm, Popover, MessageBox, Upload
} from 'element-ui'

Vue.use(Button);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Checkbox);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(CheckboxButton);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Select);
Vue.use(Option);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Popconfirm);
Vue.use(Popover);
Vue.use(Upload);


// 注册Vue全局属性
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;


