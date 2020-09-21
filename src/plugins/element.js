import Vue from 'vue'
import { Button, Tabs, TabPane, Input, Row, Col, Checkbox, Form, FormItem, Message} from 'element-ui'

Vue.use(Button);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Checkbox);
Vue.use(Form);
Vue.use(FormItem);
// 注册Vue全局属性
Vue.prototype.$message = Message;

