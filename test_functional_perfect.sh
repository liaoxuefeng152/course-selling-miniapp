#!/bin/bash

# 小程序功能测试脚本（完美版）
# 用于测试后端 API 接口功能

BASE_URL="http://localhost:3000/api"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试结果统计
TOTAL=0
PASSED=0
FAILED=0

# 测试手机号
PHONE="13800138000"
TOKEN=""
USER_ID=""
COURSE_ID="course_1776166020254"
ORDER_ID=""

# 测试结果数组
declare -a FAILED_TESTS

# 测试函数
test_api() {
    local test_name="$1"
    local method="$2"
    local url="$3"
    local data="$4"
    local expected_code="$5"

    TOTAL=$((TOTAL + 1))
    echo -e "\n${YELLOW}[测试 $TOTAL]${NC} $test_name"
    echo "请求: $method $url"

    if [ -z "$data" ]; then
        response=$(curl -s -X $method "$BASE_URL$url")
    else
        response=$(curl -s -X $method "$BASE_URL$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi

    echo "响应: $response"

    # 提取响应中的 code（支持两种格式）
    actual_code=$(echo $response | grep -o '"code":[0-9]*' | cut -d':' -f2)
    if [ -z "$actual_code" ]; then
        actual_code=$(echo $response | grep -o '"statusCode":[0-9]*' | cut -d':' -f2)
    fi

    if [ "$actual_code" = "$expected_code" ]; then
        echo -e "${GREEN}✓ 通过${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ 失败 (期望: $expected_code, 实际: $actual_code)${NC}"
        FAILED_TESTS+=("$test_name: 期望code=$expected_code, 实际code=$actual_code")
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# 测试函数（带 URL 编码）
test_api_encoded() {
    local test_name="$1"
    local method="$2"
    local url="$3"
    local query_params="$4"
    local data="$5"
    local expected_code="$6"

    TOTAL=$((TOTAL + 1))
    echo -e "\n${YELLOW}[测试 $TOTAL]${NC} $test_name"
    echo "请求: $method $url?$query_params"

    if [ -z "$data" ]; then
        response=$(curl -s -X $method "$BASE_URL$url" -G --data-urlencode "$query_params")
    else
        response=$(curl -s -X $method "$BASE_URL$url" -G --data-urlencode "$query_params" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi

    echo "响应: $response"

    # 提取响应中的 code（支持两种格式）
    actual_code=$(echo $response | grep -o '"code":[0-9]*' | cut -d':' -f2)
    if [ -z "$actual_code" ]; then
        actual_code=$(echo $response | grep -o '"statusCode":[0-9]*' | cut -d':' -f2)
    fi

    if [ "$actual_code" = "$expected_code" ]; then
        echo -e "${GREEN}✓ 通过${NC}"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ 失败 (期望: $expected_code, 实际: $actual_code)${NC}"
        FAILED_TESTS+=("$test_name: 期望code=$expected_code, 实际code=$actual_code")
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# 开始测试
echo "========================================="
echo "小程序功能测试（完美版）"
echo "========================================="
echo "测试手机号: $PHONE"
echo "固定验证码: 123456"
echo "测试课程ID: $COURSE_ID"
echo "========================================="

# 1. 用户认证模块测试
echo -e "\n${YELLOW}====== 一、用户认证模块 ======${NC}"

# 1.1 发送验证码
test_api "1.1 发送验证码" "POST" "/users/send-code" "{\"phone\":\"$PHONE\"}" "200"

# 1.2 登录（正常流程）
response=$(curl -s -X POST "$BASE_URL/users/login" \
    -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\",\"code\":\"123456\",\"role\":\"student\"}")
TOKEN=$(echo $response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $response | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "获取到的 Token: $TOKEN"
echo "获取到的 User ID: $USER_ID"

# 1.3 手机号格式错误
test_api "1.3 手机号格式错误" "POST" "/users/send-code" "{\"phone\":\"123456\"}" "400"

# 1.4 验证码错误
test_api "1.4 验证码错误" "POST" "/users/login" "{\"phone\":\"$PHONE\",\"code\":\"000000\",\"role\":\"student\"}" "400"

# 1.5 获取用户信息
test_api "1.5 获取用户信息" "GET" "/users/info?userId=$USER_ID" "" "200"

# 1.6 更新用户信息
test_api "1.6 更新用户信息" "POST" "/users/update" "{\"userId\":\"$USER_ID\",\"nickname\":\"测试用户\"}" "200"

# 1.7 退出登录
test_api "1.7 退出登录" "POST" "/users/logout" "{\"userId\":\"$USER_ID\"}" "200"

# 2. 课程模块测试
echo -e "\n${YELLOW}====== 二、课程模块 ======${NC}"

# 2.1 获取课程列表
test_api "2.1 获取课程列表" "GET" "/courses" "" "200"

# 2.2 获取课程详情
test_api "2.2 获取课程详情" "GET" "/courses/$COURSE_ID" "" "200"

# 2.3 搜索课程（使用 URL 编码）
test_api_encoded "2.3 搜索课程" "GET" "/courses" "keyword=剪辑" "" "200"

# 2.4 按分类筛选（使用 URL 编码）
test_api_encoded "2.4 按分类筛选" "GET" "/courses" "category=影视后期" "" "200"

# 2.5 按状态筛选
test_api_encoded "2.5 按状态筛选" "GET" "/courses" "status=published" "" "200"

# 3. 订单模块测试
echo -e "\n${YELLOW}====== 三、订单模块 ======${NC}"

# 3.1 创建订单
response=$(curl -s -X POST "$BASE_URL/orders/create" \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"$USER_ID\",\"courseId\":\"$COURSE_ID\",\"paymentMethod\":\"wechat\"}")
echo "创建订单响应: $response"
ORDER_ID=$(echo $response | grep -o '"orderId":"[^"]*' | cut -d'"' -f4)
echo "创建的订单ID: $ORDER_ID"

# 3.2 获取订单列表
test_api "3.2 获取订单列表" "GET" "/orders/list?userId=$USER_ID" "" "200"

# 3.3 获取订单详情
if [ -n "$ORDER_ID" ]; then
    test_api "3.3 获取订单详情" "GET" "/orders/$ORDER_ID" "" "200"
else
    echo -e "${YELLOW}跳过订单详情测试（订单创建失败）${NC}"
fi

# 3.4 订单支付
if [ -n "$ORDER_ID" ]; then
    test_api "3.4 订单支付" "POST" "/orders/$ORDER_ID/pay" "{\"transactionId\":\"trans_123456\"}" "200"
else
    echo -e "${YELLOW}跳过订单支付测试（订单ID为空）${NC}"
fi

# 3.5 创建新订单并取消（测试取消功能）
response=$(curl -s -X POST "$BASE_URL/orders/create" \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"$USER_ID\",\"courseId\":\"$COURSE_ID\",\"paymentMethod\":\"wechat\"}")
NEW_ORDER_ID=$(echo $response | grep -o '"orderId":"[^"]*' | cut -d'"' -f4)

if [ -n "$NEW_ORDER_ID" ]; then
    test_api "3.5 取消订单" "POST" "/orders/$NEW_ORDER_ID/cancel" "" "200"
else
    echo -e "${YELLOW}跳过订单取消测试（订单ID为空）${NC}"
fi

# 4. 学习模块测试
echo -e "\n${YELLOW}====== 四、学习模块 ======${NC}"

# 4.1 获取我的课程
test_api "4.1 获取我的课程" "GET" "/study/my-courses?userId=$USER_ID" "" "200"

# 4.2 记录学习进度
test_api "4.2 记录学习进度" "POST" "/study/progress" "{\"userId\":\"$USER_ID\",\"courseId\":\"$COURSE_ID\",\"lessonId\":\"l1\",\"progress\":50}" "200"

# 4.3 获取学习详情
test_api "4.3 获取学习详情" "GET" "/study/detail?userId=$USER_ID&courseId=$COURSE_ID" "" "200"

# 5. 收藏模块测试
echo -e "\n${YELLOW}====== 五、收藏模块 ======${NC}"

# 5.1 添加收藏
test_api "5.1 添加收藏" "POST" "/favorites/toggle" "{\"userId\":\"$USER_ID\",\"courseId\":\"$COURSE_ID\"}" "200"

# 5.2 获取收藏列表
test_api "5.2 获取收藏列表" "GET" "/favorites/list?userId=$USER_ID" "" "200"

# 5.3 检查收藏状态
test_api "5.3 检查收藏状态" "GET" "/favorites/check?userId=$USER_ID&courseId=$COURSE_ID" "" "200"

# 5.4 取消收藏
test_api "5.4 取消收藏" "POST" "/favorites/toggle" "{\"userId\":\"$USER_ID\",\"courseId\":\"$COURSE_ID\"}" "200"

# 6. 直播模块测试
echo -e "\n${YELLOW}====== 六、直播模块 ======${NC}"

# 6.1 获取直播列表
test_api "6.1 获取直播列表" "GET" "/live" "" "200"

# 6.2 按状态筛选直播
test_api_encoded "6.2 按状态筛选直播" "GET" "/live" "status=upcoming" "" "200"

# 7. 讲师模块测试
echo -e "\n${YELLOW}====== 七、讲师模块 ======${NC}"

# 7.1 获取讲师信息
test_api "7.1 获取讲师信息" "GET" "/instructor/info?instructorId=inst001" "" "200"

# 7.2 获取讲师课程
test_api "7.2 获取讲师课程" "GET" "/instructor/courses?instructorId=inst001" "" "200"

# 测试结果总结
echo -e "\n========================================="
echo "测试结果总结"
echo "========================================="
echo -e "总测试数: $TOTAL"
echo -e "${GREEN}通过: $PASSED${NC}"
echo -e "${RED}失败: $FAILED${NC}"
echo -e "通过率: $(awk "BEGIN {printf \"%.2f\", ($PASSED/$TOTAL)*100}")%"

if [ $FAILED -gt 0 ]; then
    echo -e "\n${RED}失败的测试:${NC}"
    for test in "${FAILED_TESTS[@]}"; do
        echo -e "${RED}✗${NC} $test"
    done
else
    echo -e "\n${GREEN}🎉 所有测试通过！${NC}"
fi

echo -e "\n========================================="
echo "测试完成"
echo "========================================="
