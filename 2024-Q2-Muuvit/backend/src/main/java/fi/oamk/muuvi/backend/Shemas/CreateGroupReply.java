package fi.oamk.muuvi.backend.Shemas;

public class CreateGroupReply {
    private String msg;
    private Long groupId;

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }
}
